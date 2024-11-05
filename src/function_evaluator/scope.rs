use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use super::value_union::ValueUnion;

pub(crate) struct Scope {
    variables: HashMap<String, ValueUnion>,
    parent: Option<Rc<RefCell<Scope>>>,
}

impl Scope {
    pub(crate) fn new() -> Rc<RefCell<Scope>> {
        return Rc::new(RefCell::new(Scope {
            variables: HashMap::new(),
            parent: None,
        }));
    }

    pub(crate) fn new_child(parent: &Rc<RefCell<Scope>>) -> Rc<RefCell<Scope>> {
        return Rc::new(RefCell::new(Scope {
            variables: HashMap::new(),
            parent: Some(parent.clone()),
        }));
    }

    pub(crate) fn get(&self, name: &String) -> Option<ValueUnion> {
        self.variables
            .get(name)
            .map(|value| value.clone())
            .or_else(|| self.parent.as_ref().and_then(|p| p.borrow().get(name)))
    }

    pub(crate) fn self_or_parent_contains(&self, name: &String) -> bool {
        self.variables.contains_key(name)
            || self
                .parent
                .as_ref()
                .map_or(false, |p| p.borrow().self_or_parent_contains(name))
    }

    fn put_internal(&mut self, name: &String, value: &ValueUnion) {
        self.variables.insert(name.clone(), value.clone());
    }

    pub(crate) fn insert(&mut self, name: &String, value: &ValueUnion) -> ValueUnion {
        if self.variables.contains_key(name) {
            self.put_internal(name, value);
        } else if let Some(parent) = self.parent.as_mut() {
            if (**parent).borrow().self_or_parent_contains(name) {
                parent.borrow_mut().insert(name, value);
            } else {
                self.put_internal(name, value);
            }
        } else {
            self.put_internal(name, value);
        }
        value.clone()
    }
}
