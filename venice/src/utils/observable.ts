import type { Observable } from "voby";

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

type UnwrapObservable<T extends Observable<any>> = T extends Observable<infer U> ? U : never;

export const withObservables = <const T extends readonly Observable<any>[], R>(
	observables: T,
	callback: (...parameters: { [K in keyof T]: UnwrapObservable<T[K]> }) => R,
) => {
	const values = observables.map((observable) => observable());
	return callback(...(values as never));
};
