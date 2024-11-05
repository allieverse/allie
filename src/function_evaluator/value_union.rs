use crate::function_evaluator::scope::Scope;

use std::cell::RefCell;
use std::fmt::Debug;
use std::rc::Rc;

#[derive(Clone, Debug)]
pub(crate) enum ValueUnion {
    Text(Rc<str>),
    Integer(i64),
    Number(f64),
    Truth(bool),
    Nothing,
    List(Vec<ValueUnion>),
    Function(FunctionPointer),
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

#[derive(Clone)]
pub(crate) struct FunctionPointer(pub(crate) Rc<dyn Fn(&mut Rc<RefCell<Scope>>) -> ValueUnion>);

impl Debug for FunctionPointer {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("FunctionPointer")
            .field(&(&self.0 as *const _))
            .finish()
    }
}
