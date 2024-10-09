import { boolean, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = boolean;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => false;

export default function ({ value }: Props) {
	return (
		<label class="CheckboxWidget Voby">
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => {
					value(e.currentTarget.checked);
				}}
			/>
			<svg class="tick" viewBox="0 0 1 1">
				<path
					d="M0.2 0.575L0.35 0.725 0.8 0.275"
					fill="none"
					stroke="white"
					stroke-linejoin="round"
					stroke-linecap="round"
				/>
			</svg>
		</label>
	);
}

export const style = /*css*/ `
@scope (.CheckboxWidget) to (.Voby) {
	:scope {
		position: relative;
		display: block;
		background: lch(100% 0 0 / 0.1);
		width: 16px;
		height: 16px;
		border-radius: 4px;
		cursor: pointer;
		transition-property: background-color;
	}

	&:hover {
		background: lch(100% 0 0 / 0.2);
	}

	&:has(:checked) {
		background: lch(50% 30 240);
	}

	&:has(:checked) .tick {
		stroke-width: 0.15px;
	}

	.tick {
		position: absolute;
		top: 0;
		stroke-width: 0;
		height: 100%;
		width: 100%;
		transition-property: stroke-width;
	}

	input {
		display: none;
	}
}
`;
