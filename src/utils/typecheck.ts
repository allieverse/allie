export type Predicate<T> = (x: unknown) => x is T;
export type UnwrapPredicate<T extends Predicate<unknown>> =
	T extends Predicate<infer U> ? U : never;
export const predicate = <T>(predicate: Predicate<T>) => predicate;

const deepEqual = <T>(a: T, b: T) => {
	if (Object.is(b, a)) return true;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a) !== Array.isArray(b)) return false;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
	}
	for (const k in a) {
		if (!(k in b) || !deepEqual(a[k], b[k])) return false;
	}
	return true;
};

// Arbitrary checks
export const any = predicate((x): x is any => true);
export const unknown = predicate((x): x is unknown => true);
export const never = predicate((x): x is never => false);

// Literals
export const literal = <const T>(value: T) => predicate((x): x is T => deepEqual(value, x));

// `typeof` checks
export const boolean = predicate((x) => typeof x === "boolean");
export const number = predicate((x) => typeof x === "number");
export const string = predicate((x) => typeof x === "string");
export const bigint = predicate((x) => typeof x === "bigint");
export const symbol = predicate((x) => typeof x === "symbol");

// Nullish checks
export const undefined_ = predicate((x) => x === undefined);
export { undefined_ as undefined };
export const defined = predicate((x) => x !== undefined);
export const null_ = predicate((x) => x === null);
export { null_ as null };
export const nonNull = predicate((x) => x !== null);
export const nullish = predicate((x) => x == null);
export const nonNullish = predicate((x) => x != null);

// Unions and intersections
export const union = <const T extends readonly Predicate<unknown>[]>(predicates: T) =>
	predicate((x): x is { [K in keyof T]: UnwrapPredicate<T[K]> }[number] => {
		for (const predicate of predicates) {
			if (predicate(x)) return true;
		}
		return false;
	});
type TupleToIntersection<T extends readonly unknown[]> = T extends [infer First, ...infer Rest]
	? First & TupleToIntersection<Rest>
	: unknown;
export const intersection = <const T extends readonly Predicate<unknown>[]>(predicates: T) =>
	predicate((x): x is TupleToIntersection<{ [K in keyof T]: UnwrapPredicate<T[K]> }> => {
		for (const predicate of predicates) {
			if (!predicate(x)) return false;
		}
		return true;
	});

// Structures
export const object = <T extends Record<keyof T, Predicate<unknown>>>(predicates: T) =>
	predicate((x): x is { [K in keyof T]: UnwrapPredicate<T[K]> } => {
		if (typeof x !== "object" || x === null) return false;
		for (const k in predicates) {
			if (!(k in x) || !predicates[k](x)) return false;
		}
		return true;
	});
export const readonlyObject: <T extends Record<keyof T, Predicate<unknown>>>(
	predicates: T,
) => Predicate<{ readonly [K in keyof T]: UnwrapPredicate<T[K]> }> = object;

export const tuple = <const T extends readonly Predicate<unknown>[]>(predicates: T) =>
	predicate((x): x is { [K in keyof T]: UnwrapPredicate<T[K]> } => {
		if (!Array.isArray(x)) return false;
		if (x.length !== predicates.length) return false;
		for (const k in predicates) {
			if (!(k in x) || !predicates[k](x)) return false;
		}
		return true;
	});
export const readonlyTuple: <const T extends readonly Predicate<unknown>[]>(
	predicates: T,
) => Predicate<{ readonly [K in keyof T]: UnwrapPredicate<T[K]> }> = tuple;

export const record = <K extends PropertyKey, V>(
	keyPredicate: Predicate<K>,
	valuePredicate: Predicate<V>,
) =>
	predicate((x): x is Record<K, V> => {
		if (typeof x !== "object" || x == null) return false;
		for (const k in x) {
			if (!keyPredicate(k) || !valuePredicate(x[k as never])) return false;
		}
		return true;
	});
export const readonlyRecord: <K extends PropertyKey, V>(
	keyPredicate: Predicate<K>,
	valuePredicate: Predicate<V>,
) => Predicate<Readonly<Record<K, V>>> = record;

export const array = <T>(itemPredicate: Predicate<T>) =>
	predicate((x) => Array.isArray(x) && x.every(itemPredicate));
export const readonlyArray: <T>(itemPredicate: Predicate<T>) => Predicate<readonly T[]> = array;

export const map = <K, V>(keyPredicate: Predicate<K>, valuePredicate: Predicate<V>) =>
	predicate((x): x is Map<K, V> => {
		if (!(x instanceof Map)) return false;
		for (const [k, v] of x) {
			if (!keyPredicate(k) || !valuePredicate(v)) return false;
		}
		return true;
	});
export const readonlyMap: <K, V>(
	keyPredicate: Predicate<K>,
	valuePredicate: Predicate<V>,
) => Predicate<ReadonlyMap<K, V>> = map;

export const set = <T>(itemPredicate: Predicate<T>) =>
	predicate((x): x is Set<T> => {
		if (!(x instanceof Set)) return false;
		for (const item of x) {
			if (!itemPredicate(item)) return false;
		}
		return true;
	});
export const readonlySet: <T>(itemPredicate: Predicate<T>) => Predicate<ReadonlySet<T>> = set;
