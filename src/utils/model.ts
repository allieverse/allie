import { Observable } from "voby";

export interface ModelProps<Type> {
	value: Observable<Type>;
}
