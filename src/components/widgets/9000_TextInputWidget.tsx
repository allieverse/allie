import { string, type UnwrapPredicate } from "../../utils/typecheck";
import type { ModelProps } from "../../utils/model";

export const matches = string;
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => "";

export default function ({ value }: Props) {
	return (
		<input
			ref={autoSizeRef}
			size={1}
			class="TextInputWidget Voby"
			type="text"
			onInput={autoSizeEventTarget}
			value={value}
			onChange={(event) => {
				value(event.currentTarget.value);
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
@scope (.TextInputWidget) to (.Voby) {
	:scope {
		width: 64px;
		background: lch(100% 0 0 / 0.075);
		text-align: center;
		border: none;
		border-radius: 4px;
		padding: 4px;
	}

	&:hover {
		background: lch(100% 0 0 / 0.125);
	}
}
`;
