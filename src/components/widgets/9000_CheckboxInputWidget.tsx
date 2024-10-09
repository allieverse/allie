import { boolean, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = boolean;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => false;

export default function ({ value }: Props) {
	return (
		<input
			type="checkbox"
			class="CheckboxInputWidget Voby"
			checked={value}
			onChange={(event) => {
				value(event.currentTarget.checked);
			}}
		/>
	);
}
