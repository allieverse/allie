use crate::function_evaluator::scope::Scope;

use std::rc::Rc;

#[derive(Clone)]
pub(crate) enum ValueUnion {
    Text(Rc<str>),
    Integer(i64),
    Number(f64),
    Truth(bool),
    Nothing,
    List(Vec<ValueUnion>),
    Function(Rc<dyn Fn(&mut Scope) -> ValueUnion>),
}

impl PartialEq for ValueUnion {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Self::Text(l0), Self::Text(r0)) => l0 == r0,
            (Self::Integer(l0), Self::Integer(r0)) => l0 == r0,
            (Self::Number(l0), Self::Number(r0)) => l0 == r0,
            (Self::Truth(l0), Self::Truth(r0)) => l0 == r0,
            (Self::List(l0), Self::List(r0)) => l0 == r0,
            (Self::Function(l0), Self::Function(r0)) => l0 as *const _ == r0 as *const _,
            _ => core::mem::discriminant(self) == core::mem::discriminant(other),
        }
    }
}
