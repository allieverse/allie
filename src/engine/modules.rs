use crate::engine::type_repr::{HasTypeRepr, TypeRepr};
use crate::macro_helpers::generate_for_tuples;
use cranelift::codegen::Context;
use cranelift::prelude::settings::{builder as flag_builder, Configurable, Flags};
use cranelift::prelude::AbiParam;
use cranelift_jit::{JITBuilder, JITModule};
use cranelift_module::{default_libcall_names, FuncId, Linkage, Module, ModuleError, ModuleResult};
use std::collections::HashMap;
use std::io::stdin;

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
                ctx: &mut Context,
            ) -> ModuleResult<()> {
                let mut sig = module.make_signature();
                $(sig.params.push(AbiParam::new($t::get_cranelift_type_repr()));)*
                let return_repr = R::get_type_repr();
                if return_repr != TypeRepr::Unit {
                    sig.returns.push(AbiParam::new(R::get_cranelift_type_repr()));
                }
                let r#fn = module.declare_function(name, Linkage::Export, &sig)?;
                let metadata = FunctionMetadata {
                    id: r#fn,
                    r#type: Self::get_type_repr(),
                };
                functions.insert(name.into(), metadata);
                module.define_function(r#fn, ctx)
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
        /* isa = Instruction Set Architecture */
        let isa_builder = cranelift_native::builder().unwrap_or_else(|msg| {
            panic!("host machine is not supported: {msg}");
        });
        let isa = isa_builder
            .finish(Flags::new(flag_builder))?;
        let mut builder = JITBuilder::with_isa(isa, default_libcall_names());
        $(builder.symbol($name, $impl as *const u8);)*
        let mut module = JITModule::new(builder);
        let mut functions = HashMap::<String, FunctionMetadata>::new();
        let mut ctx = module.make_context();
        $(DefineableFunction::define_function(&$impl, $name, &mut module, &mut functions, &mut ctx)?;)*
        module.finalize_definitions()?;
        Ok(JITModuleWithMetadata { module, functions })
    };
}
pub use define_module;

use super::cranelift_type_repr::HasCraneliftTypeRepr;

pub(crate) fn make_stdio_module() -> Result<JITModuleWithMetadata, ModuleError> {
    define_module! {
        ("read_line", stdio_read_line as extern "C" fn() -> *const String),
        ("write_line", stdio_write_line as extern "C" fn(*const String))
    }
}
