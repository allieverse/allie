use crate::engine::cranelift_type_repr::HasCraneliftTypeRepr;
use crate::engine::type_repr::{HasTypeRepr, TypeRepr};
use crate::macro_helpers::generate_for_tuples;
use cranelift::codegen::Context;
use cranelift::prelude::settings::{builder as flag_builder, Configurable, Flags};
use cranelift::prelude::{AbiParam, FunctionBuilder, FunctionBuilderContext, InstBuilder};
use cranelift_jit::{JITBuilder, JITModule};
use cranelift_module::{default_libcall_names, FuncId, Linkage, Module, ModuleError, ModuleResult};
use std::collections::HashMap;
use std::io::stdin;

fn impl_name(name: &str) -> String {
    String::from(name) + "__impl"
}

pub(crate) struct FunctionMetadata {
    pub(crate) id: FuncId,
    pub(crate) r#type: TypeRepr,
}

pub(crate) struct JITModuleWithMetadata {
    pub(crate) module: JITModule,
    pub(crate) functions: HashMap<String, FunctionMetadata>,
}

// TODO: ideally this would be generic over `impl Read` but that would be painful to jit
extern "C" fn stdio_read_line() -> *const String {
    let mut line = String::new();
    stdin().read_line(&mut line).unwrap();
    &line
}

extern "C" fn stdio_write_line(string: *const String) {
    let s = unsafe { string.as_ref() }.unwrap();
    println!("{s}")
}

trait DefineableFunction {
    fn define_function(
        &self,
        name: &str,
        module: &mut JITModule,
        functions: &mut HashMap<String, FunctionMetadata>,
        context: &mut Context,
    ) -> ModuleResult<()>;
}

macro_rules! generate_defineable_function {
    ($($t: ident),*) => {
        impl<$($t: HasTypeRepr + HasCraneliftTypeRepr,)* R: HasTypeRepr + HasCraneliftTypeRepr> DefineableFunction for extern "C" fn($($t),*) -> R
        {
            fn define_function(
                &self,
                name: &str,
                module: &mut JITModule,
                functions: &mut HashMap<String, FunctionMetadata>,
                context: &mut Context,
            ) -> ModuleResult<()> {
                context.clear();
                let signature = &mut context.func.signature;
                $(signature.params.push(AbiParam::new($t::get_cranelift_type_repr()));)*
                let return_repr = R::get_type_repr();
                if return_repr != TypeRepr::Unit {
                    signature.returns.push(AbiParam::new(R::get_cranelift_type_repr()));
                }
                let original_fn = module.declare_function(impl_name(name).as_str(), Linkage::Local, &signature)?;
                let r#fn = module.declare_function(name, Linkage::Export, &signature)?;
                let mut function_builder_context = FunctionBuilderContext::new();
                let mut function_builder = FunctionBuilder::new(&mut context.func, &mut function_builder_context);
                let entry_block = function_builder.create_block();
                function_builder.append_block_params_for_function_params(entry_block);
                function_builder.switch_to_block(entry_block);
                function_builder.seal_block(entry_block);
                let local_callee = module.declare_func_in_func(original_fn, function_builder.func);
                let params = function_builder.block_params(entry_block).to_vec();
                let call = function_builder.ins().call(local_callee, &params);
                let results = function_builder.inst_results(call).to_vec();
                function_builder.ins().return_(&results);
                function_builder.finalize();
                let metadata = FunctionMetadata { id: r#fn, r#type: Self::get_type_repr() };
                functions.insert(name.into(), metadata);
                module.define_function(r#fn, context)?;
                module.clear_context(context);
                Ok(())
            }
        }
    };
}

generate_defineable_function!();
generate_defineable_function!(T);
generate_for_tuples!(generate_defineable_function);

#[macro_export]
macro_rules! define_module {
    ($(($name: expr, $impl: expr)),*) => {
        let mut flag_builder = flag_builder();
        flag_builder.set("use_colocated_libcalls", "false")?;
        flag_builder.set("is_pic", "false")?;
        let isa_builder = cranelift_native::builder().unwrap_or_else(|msg| {
            panic!("host machine is not supported: {msg}");
        });
        let isa = isa_builder.finish(Flags::new(flag_builder))?;
        let mut builder = JITBuilder::with_isa(isa, default_libcall_names());
        $(builder.symbol(impl_name($name), $impl as *const u8);)*
        let mut module = JITModule::new(builder);
        let mut functions = HashMap::<String, FunctionMetadata>::new();
        let mut context = module.make_context();
        $(DefineableFunction::define_function(&$impl, $name, &mut module, &mut functions, &mut context)?;)*
        module.finalize_definitions()?;
        Ok(JITModuleWithMetadata { module, functions })
    };
}
pub use define_module;

pub(crate) fn make_stdio_module() -> Result<JITModuleWithMetadata, ModuleError> {
    define_module! {
        ("read_line", stdio_read_line as extern "C" fn() -> *const String),
        ("write_line", stdio_write_line as extern "C" fn(*const String))
    }
}
