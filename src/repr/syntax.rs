use std::rc::Rc;

use serde::{de::Visitor, Deserialize, Serialize};
use serde_derive::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "snake_case")]
pub(crate) enum Syntax {
    Text {
        value: RcStr,
    },
    Integer {
        value: i64,
    },
    Number {
        value: f64,
    },
    Truth {
        value: bool,
    },
    Nothing {},
    Variable {
        name: String,
        initializer: Box<Syntax>,
    },
    Reference {
        name: String,
    },
    Call {
        function: Box<Syntax>,
        parameters: Vec<Syntax>,
    },
    Function {
        name: String,
        body: Box<Syntax>,
    },
    Block {
        statements: Vec<Syntax>,
    },
    If {
        condition: Box<Syntax>,
        then_statements: Vec<Syntax>,
        else_statements: Vec<Syntax>,
    },
    While {
        condition: Box<Syntax>,
        statements: Vec<Syntax>,
    },
}

#[derive(Debug)]
pub(crate) struct RcStr(pub(crate) Rc<str>);

struct RcStrVisitor;

impl<'de> Visitor<'de> for RcStrVisitor {
    type Value = RcStr;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a string")
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        Ok(RcStr(Rc::from(v)))
    }
}

impl Serialize for RcStr {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.0.as_ref())
    }
}

impl<'de> Deserialize<'de> for RcStr {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_str(RcStrVisitor)
    }
}
