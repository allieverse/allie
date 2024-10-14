mod engine;
mod macro_helpers;

use crate::engine::modules::make_stdio_module;
use std::mem::transmute;

fn main() {
    let stdio_module = make_stdio_module().unwrap();
    let write_line_fn = stdio_module
        .module
        .get_finalized_function(stdio_module.functions["write_line"].id);
    (unsafe { transmute::<_, fn(String) -> ()>(write_line_fn) })("hello world".into());
}
