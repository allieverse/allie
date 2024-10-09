import { number, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = number;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => 0;

export default function ({ value }: Props) {
	return (
		<input
			ref={autoSizeRef}
			class="NumberInputWidget Voby"
			type="number"
			onInput={autoSizeEventTarget}
			value={value}
			onChange={(event) => {
				const newValue = event.currentTarget.valueAsNumber;
				if (!isNaN(newValue)) value(newValue);
			}}
		/>
	);
}

const autoSize = (element: HTMLElement) => {
	if (!(element instanceof HTMLElement)) return;
	element.style.width = "0";
	element.style.width = `${Math.max(64, element.scrollWidth)}px`;
};

const autoSizeRef = (element: unknown) => {
	if (element instanceof HTMLElement) requestAnimationFrame(() => autoSize(element));
};

const autoSizeEventTarget = (event: Event) => {
	const target = event.currentTarget;
	if (!(target instanceof HTMLElement)) return;
	autoSize(target);
};

export const style = /*css*/ `
@scope (.NumberInputWidget) to (.Voby) {
	:scope {
		width: 64px;
		background: lch(100% 0 0 / 0.075);
		text-align: center;
		border: none;
		border-radius: 4px;
		padding: 4px;
		appearance: none;
		-moz-appearance: textfield;
	}

	&:hover {
		background: lch(100% 0 0 / 0.125);
	}

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
}
`;
