use crate::engine::syntax::Syntax;
use cranelift::codegen::ir::FuncRef;
use cranelift::codegen::Context;
use cranelift::prelude::settings::{builder as flag_builder, Configurable, Flags};
use cranelift::prelude::{
    types, Block, FunctionBuilder, FunctionBuilderContext, InstBuilder, Value,
};
use cranelift_jit::{JITBuilder, JITModule};
use cranelift_module::{default_libcall_names, FuncId, Linkage, Module, ModuleError};

pub(crate) struct CompileContext {
    module: JITModule,
    context: Context,
    builder: FunctionBuilderContext,
}

// wtf
pub(crate) fn new_context() -> Result<CompileContext, ModuleError> {
    let mut flag_builder = flag_builder();
    flag_builder.set("use_colocated_libcalls", "false")?;
    flag_builder.set("is_pic", "false")?;
    let isa_builder = cranelift_native::builder().unwrap_or_else(|msg| {
        panic!("host machine is not supported: {msg}");
    });
    let isa = isa_builder.finish(Flags::new(flag_builder))?;
    let builder = JITBuilder::with_isa(isa, default_libcall_names());
    let module = JITModule::new(builder);
    let context = module.make_context();
    let function_builder_context = FunctionBuilderContext::new();
    Ok(CompileContext {
        module,
        context,
        builder: function_builder_context,
    })
}

pub(crate) fn compile(
    name: &str,
    syntax: &Syntax,
    context: &mut CompileContext,
) -> Result<FuncId, ModuleError> {
    let signature = &mut context.context.func.signature;
    let r#fn = context
        .module
        .declare_function(name, Linkage::Export, &signature)?;
    let mut function_builder =
        FunctionBuilder::new(&mut context.context.func, &mut context.builder);
    let value = compile_syntax(syntax, &mut function_builder);
    function_builder.ins().return_(&[value]);
    function_builder.finalize();
    context.module.define_function(r#fn, &mut context.context)?;
    context.module.clear_context(&mut context.context);
    Ok(r#fn)
}

fn compile_syntax(syntax: &Syntax, builder: &mut FunctionBuilder) -> Value {
    match syntax {
        Syntax::Text { value } => todo!(),
        Syntax::Integer { value } => builder.ins().iconst(types::I64, *value),
        Syntax::Number { value } => builder.ins().f64const(*value),
        // TODO: should bools be `i8`?
        Syntax::Truth { value } => builder.ins().iconst(types::I64, if *value { 1 } else { 0 }),
        Syntax::Variable { name, initializer } => todo!(),
        Syntax::Reference { name } => todo!(),
        Syntax::Nothing {} => todo!(),
        Syntax::Call {
            function,
            parameters,
        } => todo!(),
        Syntax::Function { name, body } => todo!(),
        Syntax::Block { statements } => todo!(),
        Syntax::If {
            condition,
            then_statements,
            else_statements,
        } => {
            let condition = compile_syntax(condition, builder);
            let mut block_merge = builder.create_block();
            let block_then = compile_block(then_statements, builder, &mut block_merge);
            let block_else = compile_block(else_statements, builder, &mut block_merge);
            builder
                .ins()
                .brif(condition, block_then, &[], block_else, &[]);
            builder.switch_to_block(block_merge);
            builder.seal_block(block_merge);
            builder.block_params(block_merge)[0]
        }
        Syntax::For {
            iterable,
            statements,
        } => todo!(),
        Syntax::While {
            condition,
            statements,
        } => todo!(),
    }
}

pub(crate) fn compile_block(
    statements: &Vec<Syntax>,
    builder: &mut FunctionBuilder,
    return_block: &mut Block,
) -> Block {
    let block = builder.create_block();
    builder.switch_to_block(block);
    builder.seal_block(block);
    let mut value = None;
    for statement in statements {
        // FIXME:
    }
    let value = value.unwrap_or_else(|| builder.ins().iconst(types::I64, 0));
    builder.ins().jump(*return_block, &[value]);
    block
}
