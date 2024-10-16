use crate::macro_helpers::generate_for_tuples;

#[derive(PartialEq, Eq, Debug)]
pub struct StructMember {
    pub name: String,
    pub r#type: TypeRepr,
}

#[derive(PartialEq, Eq, Debug)]
pub struct EnumMember {
    pub name: String,
    pub r#type: TypeRepr,
}

#[derive(PartialEq, Eq, Debug)]
pub enum TypeRepr {
    Unit,
    I8,
    I16,
    I32,
    I64,
    I128,
    U8,
    U16,
    U32,
    U64,
    U128,
    F32,
    F64,
    String,
    Function(Vec<TypeRepr>, Box<TypeRepr>),
    Slice(Box<TypeRepr>),
    Tuple(Vec<TypeRepr>),
    Struct(Vec<StructMember>),
    Enum(Vec<EnumMember>),
}

pub trait HasTypeRepr {
    fn get_type_repr() -> TypeRepr;
}

impl HasTypeRepr for () {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::Unit
    }
}

impl HasTypeRepr for i8 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::I8
    }
}

impl HasTypeRepr for i16 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::I16
    }
}

impl HasTypeRepr for i32 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::I32
    }
}

impl HasTypeRepr for i64 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::I64
    }
}

impl HasTypeRepr for i128 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::I128
    }
}

impl HasTypeRepr for u8 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::U8
    }
}

impl HasTypeRepr for u16 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::U16
    }
}

impl HasTypeRepr for u32 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::U32
    }
}

impl HasTypeRepr for u64 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::U64
    }
}

impl HasTypeRepr for u128 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::U128
    }
}

impl HasTypeRepr for f32 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::F32
    }
}

impl HasTypeRepr for f64 {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::F64
    }
}

impl HasTypeRepr for *const String {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::String
    }
}

impl<T: HasTypeRepr> HasTypeRepr for &[T] {
    fn get_type_repr() -> TypeRepr {
        TypeRepr::Slice(Box::new(T::get_type_repr()))
    }
}

macro_rules! generate_tuple_type_repr {
    ($($t: ident),*) => {
        impl<$($t: HasTypeRepr),*> HasTypeRepr for ($($t),*) {
            fn get_type_repr() -> TypeRepr {
                TypeRepr::Tuple(vec![$($t::get_type_repr()),*])
            }
        }
    };
}

generate_for_tuples!(generate_tuple_type_repr);

macro_rules! generate_function_type_repr {
    ($($t: ident),*) => {
        impl<$($t: HasTypeRepr,)* R: HasTypeRepr> HasTypeRepr for extern "C" fn($($t),*) -> R {
            fn get_type_repr() -> TypeRepr {
                TypeRepr::Function(vec![$($t::get_type_repr()),*], Box::new(R::get_type_repr()))
            }
        }
    };
}

generate_function_type_repr!();
generate_function_type_repr!(T);
generate_for_tuples!(generate_function_type_repr);

// TODO: impl for `f128` (currently unstable)

// TODO: trait impl for the below. they might have to be proc macros
// Struct(Vec<StructMember>),
// Enum(Vec<EnumMember>),
