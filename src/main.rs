mod compiler;
mod function_evaluator;
mod macro_helpers;
mod repr;

use crate::compiler::compile::{compile, new_context};
use crate::compiler::modules::make_stdio_module;
use crate::function_evaluator::evaluate::syntax_to_function;
use crate::function_evaluator::scope::Scope;
use crate::repr::syntax::Syntax;
use cranelift_module::ModuleError;
use std::mem::transmute;

fn main() -> Result<(), ModuleError> {
    let stdio_module = make_stdio_module().unwrap();
    let write_line_fn = stdio_module
        .module
        .get_finalized_function(stdio_module.functions["write_line"].id);
    let mut context = new_context()?;
    let test = compile("test", &Syntax::Block { statements: vec![] }, &mut context)?;
    let mut scope = Scope::new();
    let function = syntax_to_function(&Syntax::Block { statements: vec![] });
    let ret = function(&mut scope);
    println!("function_evaluator returned: {:?}", ret);
    (unsafe { transmute::<_, fn(String) -> ()>(write_line_fn) })("hello world".into());
    Ok(())
}
