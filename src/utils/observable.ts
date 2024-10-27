import type { Observable } from "voby";
import { indexLens, keyLens, type Lens } from "./optics";

export const observable = <T>(get: () => T, set: (value: T) => void) =>
	((...args: [] | [T]) => {
		switch (args.length) {
			case 0:
				return get();
			case 1:
				set(args[0]);
				break;
		}
	}) as Observable<T>;

export const project = <T, U>(parent: Observable<T>, lens: Lens<T, U>) =>
	observable(
		() => lens.get(parent()),
		(value) => parent(lens.set(parent(), value)),
	);

export const projectKey = <T extends object, Key extends keyof T>(
	parent: Observable<T>,
	key: Key,
) => project(parent, keyLens<T>()(key));

export const projectIndex = <T extends readonly unknown[], Index extends number>(
	parent: Observable<T>,
	key: Index,
) => project(parent, indexLens<T>()(key));

type UnwrapObservable<T extends Observable<any>> = T extends Observable<infer U> ? U : never;

export const withObservables = <const T extends readonly Observable<any>[], R>(
	observables: T,
	callback: (...parameters: { [K in keyof T]: UnwrapObservable<T[K]> }) => R,
) => {
	const values = observables.map((observable) => observable());
	return callback(...(values as never));
};
