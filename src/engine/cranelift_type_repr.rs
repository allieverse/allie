use cranelift::prelude::{types, Type};

const POINTER_TYPE: cranelift::prelude::Type = types::I64;

pub(crate) trait HasCraneliftTypeRepr {
    fn get_cranelift_type_repr() -> Type;
}

impl HasCraneliftTypeRepr for () {
    fn get_cranelift_type_repr() -> Type {
        return types::I8;
    }
}

impl HasCraneliftTypeRepr for i8 {
    fn get_cranelift_type_repr() -> Type {
        return types::I8;
    }
}

impl HasCraneliftTypeRepr for i16 {
    fn get_cranelift_type_repr() -> Type {
        return types::I16;
    }
}

impl HasCraneliftTypeRepr for i32 {
    fn get_cranelift_type_repr() -> Type {
        return types::I32;
    }
}

impl HasCraneliftTypeRepr for i64 {
    fn get_cranelift_type_repr() -> Type {
        return types::I64;
    }
}

impl HasCraneliftTypeRepr for i128 {
    fn get_cranelift_type_repr() -> Type {
        return types::I128;
    }
}

impl HasCraneliftTypeRepr for u8 {
    fn get_cranelift_type_repr() -> Type {
        return types::I8;
    }
}

impl HasCraneliftTypeRepr for u16 {
    fn get_cranelift_type_repr() -> Type {
        return types::I16;
    }
}

impl HasCraneliftTypeRepr for u32 {
    fn get_cranelift_type_repr() -> Type {
        return types::I32;
    }
}

impl HasCraneliftTypeRepr for u64 {
    fn get_cranelift_type_repr() -> Type {
        return types::I64;
    }
}

impl HasCraneliftTypeRepr for u128 {
    fn get_cranelift_type_repr() -> Type {
        return types::I128;
    }
}

impl HasCraneliftTypeRepr for f32 {
    fn get_cranelift_type_repr() -> Type {
        return types::F32;
    }
}

impl HasCraneliftTypeRepr for f64 {
    fn get_cranelift_type_repr() -> Type {
        return types::F64;
    }
}

impl HasCraneliftTypeRepr for *const String {
    fn get_cranelift_type_repr() -> Type {
        return POINTER_TYPE;
    }
}
