export interface Getter<T, U> {
	get: (value: T) => U;
}

export interface Setter<T, U> {
	set: (value: T, inner: U) => T;
}

export interface Lens<T, U> extends Getter<T, U>, Setter<T, U> {}

export const composeLenses = <T, U, V>(a: Lens<T, U>, b: Lens<U, V>): Lens<T, V> => ({
	get: (object) => b.get(a.get(object)),
	set: (object, value) => a.set(object, b.set(a.get(object), value)),
});

export const keyLens =
	<T extends object = never>() =>
	<Key extends keyof T>(key: Key): Lens<T, T[Key]> => ({
		get: (object) => object[key],
		set: (object, value) => {
			const newObject = { ...object };
			newObject[key] = value;
			return newObject;
		},
	});

export const indexLens =
	<T extends readonly unknown[] = never>() =>
	<Index extends number>(index: Index): Lens<T, T[Index]> => ({
		get: (array) => array[index],
		set: (array, value) => {
			const newArray = Array.from(array) as unknown as T;
			newArray[index] = value;
			return newArray;
		},
	});

export type Maybe<T> = readonly [T] | readonly [];

export interface MaybeGetter<T, U> {
	get: (value: T) => Maybe<U>;
}

export interface MaybeSetter<T, U> {
	set: (variant: U) => T;
}

export interface Prism<T, U> extends MaybeGetter<T, U>, MaybeSetter<T, U> {}

// A `.flatMap` would work here (the reason behind the choice of encoding for `Maybe`)
// but it is not type-safe.
const mapMaybe = <T, R>(fn: (value: T) => Maybe<R>, value: Maybe<T>): Maybe<R> =>
	value.length === 1 ? fn(value[0]) : [];

const maybeOr = <T>(value: Maybe<T>, fallback: T): T => (value.length === 1 ? value[0] : fallback);

export const over = <T, U>(fn: (value: U) => U, prism: Prism<T, U>, value: T) =>
	maybeOr(
		mapMaybe((value) => [prism.set(fn(value))], prism.get(value)),
		value,
	);

export const composePrisms = <T, U, V>(a: Prism<T, U>, b: Prism<U, V>): Prism<T, V> => ({
	get: (object) => mapMaybe((value) => b.get(value), a.get(object)),
	set: (value) => a.set(b.set(value)),
});

export const tagPrism =
	<T = never>() =>
	<Key extends keyof T, Tag extends (string | number | boolean) & T[Key]>(
		key: Key,
		tag: Tag,
	): Prism<T, Extract<T, Readonly<Record<Key, Tag>>>> => ({
		get: (value) => (value[key] === tag ? [value as Extract<T, Readonly<Record<Key, Tag>>>] : []),
		set: (value) => value,
	});

export const nullishPrism = <T>(): Prism<T | null | undefined, T> => ({
	get: (value) => (value != null ? [value] : []),
	set: (value) => value,
});

export const nonNullPrism = <T>(): Prism<T | null, T> => ({
	get: (value) => (value !== null ? [value] : []),
	set: (value) => value,
});

export const definedPrism = <T>(): Prism<T | undefined, T> => ({
	get: (value) => (value !== undefined ? [value] : []),
	set: (value) => value,
});
