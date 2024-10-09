import { ModelProps } from "../utils/model";

export type WidgetRenderer = (props: ModelProps<unknown>) => JSX.Child;

export interface WidgetModule<Type = unknown> {
	default: WidgetRenderer;
	matches: (value: unknown) => value is Type;
	defaultValue: () => Type;
}

export type WidgetRegistry = WidgetModule[];

export const allWidgetModules: WidgetRegistry = [];

export const registerWidget = (module: WidgetModule) => {
	allWidgetModules.push(module);
};

export const getWidget = (value: unknown) =>
	allWidgetModules.find((module) => module.matches(value))?.default;

// TODO: the metadata to determine which widget gets shown must be stored somewhere
export const getAllMatchingWidgets = (value: unknown) =>
	allWidgetModules.filter((module) => module.matches(value)).map((module) => module.default);

export interface WidgetProps extends ModelProps<unknown> {}

export default function Widget({ value }: WidgetProps) {
	const Widget = getWidget(value());
	return Widget && <Widget value={value} />;
}
