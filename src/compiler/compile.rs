use crate::engine::syntax::Syntax;
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

fn nothing(builder: &mut FunctionBuilder) -> Value {
    builder.ins().iconst(types::I8, 0)
}

fn compile_syntax(syntax: &Syntax, builder: &mut FunctionBuilder) -> Value {
    match syntax {
        Syntax::Text { value } => todo!(),
        Syntax::Integer { value } => builder.ins().iconst(types::I64, *value),
        Syntax::Number { value } => builder.ins().f64const(*value),
        Syntax::Truth { value } => builder.ins().iconst(types::I8, if *value { 1 } else { 0 }),
        Syntax::Variable { name, initializer } => todo!(),
        Syntax::Reference { name } => todo!(),
        Syntax::Nothing {} => nothing(builder),
        Syntax::Call {
            function,
            parameters,
        } => {
            let function = compile_syntax(function, builder);
            let args = parameters
                .into_iter()
                .map(|parameter| compile_syntax(parameter, builder))
                .collect::<Vec<Value>>();
            let call = builder.ins().call(function, args.as_slice());
            builder
                .inst_results(call)
                .first()
                .map_or_else(|| nothing(builder), |value| *value)
        }
        Syntax::Function { name, body } => todo!(),
        Syntax::Block { statements } => todo!(),
        Syntax::If {
            condition,
            then_statements,
            else_statements,
        } => {
            let block_start = builder.create_block();
            let mut block_merge = builder.create_block();
            let block_then = compile_block(then_statements, builder, Some(&mut block_merge));
            let block_else = compile_block(else_statements, builder, Some(&mut block_merge));

            builder.switch_to_block(block_start);
            builder.seal_block(block_start);
            let condition = compile_syntax(condition, builder);
            builder
                .ins()
                .brif(condition, block_then, &[], block_else, &[]);

            builder.switch_to_block(block_merge);
            builder.seal_block(block_merge);
            builder.block_params(block_merge)[0]
        }
        Syntax::While {
            condition,
            statements,
        } => {
            let block_start = builder.create_block();
            let mut block_end = builder.create_block();
            let block_body = compile_block(statements, builder, None);

            builder.switch_to_block(block_start);
            builder.seal_block(block_start);
            let condition = compile_syntax(condition, builder);
            builder
                .ins()
                .brif(condition, block_body, &[], block_end, &[]);

            builder.switch_to_block(block_end);
            builder.seal_block(block_end);
            builder.block_params(block_end)[0]
        }
    }
}

pub(crate) fn compile_block(
    statements: &Vec<Syntax>,
    builder: &mut FunctionBuilder,
    return_block: Option<&mut Block>,
) -> Block {
    let block = builder.create_block();
    builder.switch_to_block(block);
    builder.seal_block(block);
    let mut value = None;
    for statement in statements {
        value = Some(compile_syntax(statement, builder));
    }
    if let Some(return_block) = return_block {
        let value = value.unwrap_or_else(|| builder.ins().iconst(types::I64, 0));
        builder.ins().jump(*return_block, &[value]);
    }
    block
}
