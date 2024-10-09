import { action, runAction } from "../../types/actions";
import { observable } from "../../utils/observable";
import { array, literal, object, unknown, type UnwrapPredicate } from "../../utils/typecheck";
import Widget from "../Widget";

export const matches = object({
	type: literal("button"),
	onClick: action,
	children: array(unknown),
});
export type Type = UnwrapPredicate<typeof matches>;
export interface Props {
	value: Type;
}
export const defaultValue = (): Type => ({
	type: "button",
	onClick: { type: "none" },
	children: [],
});

export default function ({ value }: Props) {
	return (
		<button type="button" class="ButtonWidget Voby" onClick={() => runAction(value.onClick)}>
			{value.children.map((child) => (
				<Widget
					value={observable(
						() => child,
						() => {},
					)}
				/>
			))}
		</button>
	);
}
