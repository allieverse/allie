use serde_derive::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename_all = "snake_case")]
pub(crate) enum Syntax {
    Text {
        value: String,
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
    For {
        iterable: Box<Syntax>,
        statements: Vec<Syntax>,
    },
    While {
        condition: Box<Syntax>,
        statements: Vec<Syntax>,
    },
}
