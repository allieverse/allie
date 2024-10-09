import { null_, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = null_;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => null;

export default function () {
	return <div class="NothingWidget Voby">_</div>;
}

export const style = /*css*/ `
@scope (.NothingWidget) to (.Voby) {
	:scope {
		display: block;
	}
}
`;
