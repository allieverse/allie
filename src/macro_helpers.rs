macro_rules! generate_for_tuples {
    ($macro: ident) => {
        $macro!(T, U);
        $macro!(T, U, V);
        $macro!(T, U, V, W);
        $macro!(T, U, V, W, X);
        $macro!(T, U, V, W, X, Y);
        $macro!(T, U, V, W, X, Y, Z);
        $macro!(T, U, V, W, X, Y, Z, A);
        $macro!(T, U, V, W, X, Y, Z, A, B);
        $macro!(T, U, V, W, X, Y, Z, A, B, C);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D, E);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D, E, F);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D, E, F, G);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D, E, F, G, H);
        $macro!(T, U, V, W, X, Y, Z, A, B, C, D, E, F, G, H, I);
    };
}
pub(crate) use generate_for_tuples;
