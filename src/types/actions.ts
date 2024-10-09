import { literal, object, string, union, type UnwrapPredicate } from "../utils/typecheck";

export const runAction = (action: Action) => {
	switch (action.type) {
		case "none":
			break;
		case "openLink":
			window.open(action.url, "_blank");
			break;
	}
};

export const noneAction = object({ type: literal("none") });
export type NoneAction = UnwrapPredicate<typeof noneAction>;
export const openLinkAction = object({
	type: literal("openLink"),
	url: string,
});
export type OpenLinkAction = UnwrapPredicate<typeof openLinkAction>;

export const action = union([noneAction, openLinkAction]);
export type Action = UnwrapPredicate<typeof action>;
