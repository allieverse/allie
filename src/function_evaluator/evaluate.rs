use std::cell::RefCell;
use std::rc::Rc;

use crate::function_evaluator::scope::Scope;
use crate::function_evaluator::value_union::ValueUnion;
use crate::repr::syntax::Syntax;

use super::value_union::FunctionPointer;

pub(crate) fn syntax_to_function(
    syntax: &Syntax,
) -> Box<dyn Fn(&mut Rc<RefCell<Scope>>) -> ValueUnion> {
    match syntax {
        Syntax::Text { value } => {
            let value = value.0.clone();
            Box::new(move |_| ValueUnion::Text(value.clone()))
        }
        Syntax::Integer { value } => {
            let value = *value;
            Box::new(move |_| ValueUnion::Integer(value))
        }
        Syntax::Number { value } => {
            let value = *value;
            Box::new(move |_| ValueUnion::Number(value))
        }
        Syntax::Truth { value } => {
            let value = *value;
            Box::new(move |_| ValueUnion::Truth(value))
        }
        Syntax::Nothing {} => Box::new(|_| ValueUnion::Nothing),
        Syntax::Variable { name, initializer } => {
            let name = name.clone();
            let initializer = syntax_to_function(initializer);
            Box::new(move |s| {
                let value = initializer(s);
                s.borrow_mut().insert(&name, &value);
                ValueUnion::Nothing
            })
        }
        Syntax::Reference { name } => {
            let name = name.clone();
            Box::new(move |s| (**s).borrow().get(&name).unwrap_or(ValueUnion::Nothing))
        }
        Syntax::Call {
            function,
            parameters,
        } => {
            let function = syntax_to_function(function);
            // FIXME: function arguments
            Box::new(move |s| function(s))
        }
        Syntax::Function { name, body } => {
            // FIXME: function arguments
            let name = name.clone();
            let body = syntax_to_function(body);
            let f = ValueUnion::Function(FunctionPointer(Rc::new(move |s| {
                let mut child = Scope::new_child(s);
                body(&mut child)
            })));
            Box::new(move |s| s.borrow_mut().insert(&name, &f))
        }
        Syntax::Block { statements } => block_to_function(statements),
        Syntax::If {
            condition,
            then_statements,
            else_statements,
        } => {
            let condition = syntax_to_function(&condition);
            let then_statements = block_to_function(then_statements);
            let else_statements = block_to_function(else_statements);
            Box::new(move |s| {
                if condition(s) == ValueUnion::Truth(true) {
                    then_statements(s)
                } else {
                    else_statements(s)
                }
            })
        }
        Syntax::While {
            condition,
            statements,
        } => {
            let condition = syntax_to_function(&condition);
            let statements = block_to_function(statements);
            Box::new(move |s| {
                let mut child = Scope::new_child(s);
                while condition(s) == ValueUnion::Truth(true) {
                    statements(&mut child);
                }
                ValueUnion::Nothing
            })
        }
    }
}

fn block_to_function(
    statements: &Vec<Syntax>,
) -> Box<dyn Fn(&mut Rc<RefCell<Scope>>) -> ValueUnion> {
    let statements = statements
        .iter()
        .map(syntax_to_function)
        .collect::<Vec<_>>();
    Box::new(move |s| {
        let mut result = ValueUnion::Nothing;
        statements.iter().for_each(|f| result = f(s));
        result
    })
}
