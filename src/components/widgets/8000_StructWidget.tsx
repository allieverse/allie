import Widget from "../../components/Widget";
import { removeDragImage } from "../../utils/drag";
import type { ModelProps } from "../../utils/model";
import { readonlyRecord, string, unknown, UnwrapPredicate } from "../../utils/typecheck";
import { $, Observable, Portal, useEventListener } from "voby";
import { observable, withObservables } from "../../utils/observable";

export const matches = readonlyRecord(string, unknown);
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => ({});

const DRAG_HANDLE_HORIZONTAL_OFFSET = -10;

interface DragInfo {
	readonly index: number;
	readonly key: string;
	readonly x: number;
	readonly y: number;
	readonly element: HTMLElement;
	readonly height: number;
}

const newKey = $<string>();
const dragInfo = $<DragInfo>();

const replaceKey = (value: Type, oldK: string, newK: string): Type => {
	return Object.fromEntries(Object.entries(value).map(([k, v]) => [k === oldK ? newK : k, v]));
};

const updateDragPosition = (event: DragEvent) => {
	const dragInfo_ = dragInfo();
	if (!dragInfo_ || (event.clientX === 0 && event.clientY === 0)) return;
	dragInfo({ ...dragInfo_, x: event.clientX, y: event.clientY });
};

const verticalCenter = (element: Element) => {
	const rect = element.getBoundingClientRect();
	return rect.top + rect.height / 2;
};

const onDrag = (event: DragEvent, value: Observable<Type>) => {
	const dragInfo_ = dragInfo();
	if (event.clientY <= 0 || !dragInfo_) return;
	if (event.clientX === 0 && event.clientY === 0) return;
	const dragIndex = dragInfo_.index;
	updateDragPosition(event);
	const nextSibling = dragInfo_.element.nextElementSibling;
	if (nextSibling && event.clientY >= verticalCenter(nextSibling)) {
		const entries = Object.entries(value);
		const draggedItem = entries[dragIndex];
		if (!draggedItem) return;
		entries.splice(dragIndex, 1);
		entries.splice(dragIndex + 1, 0, draggedItem);
		value(Object.fromEntries(entries));
		dragInfo({ ...dragInfo_, index: dragInfo_.index + 1 });
		return;
	}
	const prevSibling = dragInfo_.element.previousElementSibling;
	if (prevSibling && event.clientY <= verticalCenter(prevSibling)) {
		const entries = Object.entries(value);
		const draggedItem = entries[dragIndex];
		if (!draggedItem) return;
		entries.splice(dragIndex, 1);
		entries.splice(dragIndex - 1, 0, draggedItem);
		value(Object.fromEntries(entries));
		dragInfo({ ...dragInfo_, index: dragInfo_.index - 1 });
		return;
	}
};

const onDragStart = (event: DragEvent, value: Observable<Type>, i: number, k: string) => {
	dragInfo({ index: i, key: k, x: 0, y: 0, element: null!, height: 0 });
	updateDragPosition(event);
	event.dataTransfer?.setData("application/json", JSON.stringify(value()[k]));
	removeDragImage(event);
};

const onDragEnd = () => {
	dragInfo(undefined);
};

// FIXME: dragging the empty space makes the parent's drag trigger

export default function ({ value }: Props) {
	useEventListener(document, "dragover", (event) => {
		if (dragInfo()) {
			onDrag(event, value);
		}
	});

	// TODO: convenient struct editor.
	return (
		<div class="StructWidget Voby">
			<span class="title">struct</span>
			<table>
				<tbody>
					{() =>
						Object.entries(value()).map(([k, item], i) => (
							<tr
								ref={(el) => {
									const dragInfo_ = dragInfo();
									if (k === dragInfo_?.key) {
										dragInfo({
											...dragInfo_,
											element: el,
											height: el.getBoundingClientRect().height,
										});
									}
								}}
								class={() => ({
									item: true,
									dragging: () => k === dragInfo()?.key,
								})}
								draggable="true"
								onDrag={(event) => {
									event.stopPropagation();
									onDrag(event, value);
								}}
								onDragStart={(event) => {
									event.stopPropagation();
									onDragStart(event, value, i, k);
								}}
								onDragEnd={(event) => {
									event.stopPropagation();
									onDragEnd();
								}}
							>
								<td class="drag-handle">
									<svg viewBox="0 0 1 1" height="16" width="16">
										<path
											d="M.2.35L.8.35ZM.2.65L.8.65"
											stroke="lch(100 0 0 / 0.2)"
											stroke-width="0.15"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</td>
								<td>
									<Widget
										value={observable<unknown>(
											() => k,
											(newK) => {
												value(replaceKey(value(), k, String(newK)));
											},
										)}
									/>
									:&nbsp;
								</td>
								<td>
									<Widget
										value={observable(
											() => item,
											(newItem) => {
												const result = { ...value() };
												result[k] = newItem;
												value(result);
											},
										)}
									/>
								</td>
							</tr>
						))
					}
				</tbody>
			</table>
			<form
				class="new-key-form"
				onSubmit={(event) => {
					event.preventDefault();
				}}
			>
				<button
					type="button"
					disabled={() =>
						withObservables([newKey], (newKey) => newKey === undefined || newKey in value)
					}
					title={() =>
						withObservables([newKey], (newKey) =>
							newKey !== undefined && newKey in value
								? "this struct already has a key named '" + newKey + "'"
								: "",
						)
					}
					onClick={() => {
						const newKey_ = newKey();
						if (newKey_) {
							const newValue = { ...value() };
							newValue[newKey_] = null;
							value(newValue);
						}
					}}
				>
					+
				</button>
				<div>
					<input
						type="text"
						class="new-key"
						value={newKey()}
						onChange={(event) => {
							newKey(event.currentTarget.value);
						}}
					/>
					:
				</div>
			</form>
			{() => {
				const dragInfo_ = dragInfo();
				return (
					dragInfo_ && (
						<Portal mount={document.body}>
							<div
								class="item dragged-item"
								style={{
									left: dragInfo_.x + DRAG_HANDLE_HORIZONTAL_OFFSET,
									top: dragInfo_.y - dragInfo_.height / 2,
								}}
							>
								<svg class="drag-handle" viewBox="0 0 1 1" height="16" width="16">
									<path
										d="M.3.35L.7.35ZM.3.65L.7.65"
										stroke="lch(100 0 0 / 0.2)"
										stroke-width="0.15"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								{dragInfo_.key}:&nbsp;
								<Widget
									value={observable(
										() => value()[dragInfo_.key],
										(newItem) => {
											const newValue = { ...value() };
											newValue[dragInfo_.key] = newItem;
											value(newValue);
										},
									)}
								/>
							</div>
						</Portal>
					)
				);
			}}
		</div>
	);
}

export const style = /*css*/ `
@scope (.StructWidget) to (.Voby > *) {
	.item > * {
		pointer-events: auto;
	}
}

@scope (.StructWidget) to (.Voby) {
	:scope {
		display: flex;
		flex-flow: column;
		border: 1px solid lch(100% 0 0 / 45%);
		border-radius: 4px;
		padding: 4px;
		width: max-content;
	}

	.title {
		font-size: 66.6666%;
	}

	ol {
		display: flex;
		flex-flow: column;
		margin-block: 0;
		margin-inline: 0;
		padding-inline: 0;
		list-style-type: none;
		gap: 4px;
	}

	.item {
		pointer-events: none;
	}

	button {
		background: lch(100% 0 0 / 10%);
		border-radius: 4px;
		width: 16px;
		height: 16px;
		transition-property: background-color;
	}

	button:not(:disabled):hover {
		background: lch(100% 0 0 / 20%);
	}

	.dragging {
		opacity: 50%;
	}

	.drag-handle {
		align-self: stretch;
		display: flex;
		align-items: center;
		cursor: grab;
		margin-right: 4px;
	}

	.dragged-item {
		display: flex;
		position: fixed;
		pointer-events: none;
		background: lch(100% 0 0 / 10%);
		padding: 4px;
		border-radius: 4px;
	}

	.new-key-form {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.new-key {
		width: 64px;
		background: lch(100% 0 0 / 7.5%);
		text-align: center;
		border: none;
		border-radius: 4px;
		padding: 4px;
	}
}
`;
