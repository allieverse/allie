mod engine;
mod macro_helpers;

use crate::engine::compile::{compile, new_context};
use crate::engine::modules::make_stdio_module;
use crate::engine::syntax::Syntax;
use cranelift_module::ModuleError;
use std::mem::transmute;

fn main() -> Result<(), ModuleError> {
    let stdio_module = make_stdio_module().unwrap();
    let write_line_fn = stdio_module
        .module
        .get_finalized_function(stdio_module.functions["write_line"].id);
    let mut context = new_context()?;
    let test = compile("test", &Syntax::Block { statements: vec![] }, &mut context)?;
    (unsafe { transmute::<_, fn(String) -> ()>(write_line_fn) })("hello world".into());
    Ok(())
}
