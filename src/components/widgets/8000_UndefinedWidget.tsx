import { undefined_, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = undefined_;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => undefined;

export default function () {
	return <div class="UndefinedWidget Voby">__</div>;
}

export const style = /*css*/ `
@scope (.UndefinedWidget) to (.Voby) {
	:scope {
		display: block;
	}
}
`;
