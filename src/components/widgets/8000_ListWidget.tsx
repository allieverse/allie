import { $, Observable, Portal } from "voby";
import Widget from "../../components/Widget";
import { removeDragImage } from "../../utils/drag";
import type { ModelProps } from "../../utils/model";
import { readonlyArray, unknown, UnwrapPredicate } from "../../utils/typecheck";
import { observable } from "../../utils/observable";

export const matches = readonlyArray(unknown);
export type Type = UnwrapPredicate<typeof matches>;
export interface Props extends ModelProps<Type> {}
export const defaultValue = (): Type => [];

const DRAG_HANDLE_HORIZONTAL_OFFSET = -10;

interface DragInfo {
	readonly index: number;
	readonly x: number;
	readonly y: number;
	readonly element: HTMLElement;
	readonly height: number;
}

const dragInfo = $<DragInfo>();

const updateDragPosition = (event: DragEvent) => {
	const dragInfo_ = dragInfo();
	if (!dragInfo_) return;
	dragInfo({ ...dragInfo_, x: event.clientX, y: event.clientY });
};

const verticalCenter = (element: Element) => {
	const rect = element.getBoundingClientRect();
	return rect.top + rect.height / 2;
};

const onDrag = (event: DragEvent, value: Observable<Type>) => {
	const dragInfo_ = dragInfo();
	const value_ = value();
	if (event.clientY < 0 || !dragInfo_) return;
	if (event.clientX === 0 && event.clientY === 0) return;
	const dragIndex = dragInfo_.index;
	updateDragPosition(event);
	const nextSibling = dragInfo_.element.nextElementSibling;
	if (nextSibling && event.clientY >= verticalCenter(nextSibling)) {
		const draggedItem = value_[dragIndex];
		const newValue = [...value_];
		newValue.splice(dragIndex, 1);
		newValue.splice(dragIndex + 1, 0, draggedItem);
		value(newValue);
		dragInfo({ ...dragInfo_, index: dragInfo_.index + 1 });
		return;
	}
	const prevSibling = dragInfo_.element.previousElementSibling;
	if (prevSibling && event.clientY <= verticalCenter(prevSibling)) {
		const draggedItem = value_[dragIndex];
		const newValue = [...value_];
		newValue.splice(dragIndex, 1);
		newValue.splice(dragIndex - 1, 0, draggedItem);
		value(newValue);
		dragInfo({ ...dragInfo_, index: dragInfo_.index - 1 });
		return;
	}
};

const onDragStart = (event: DragEvent, value: Observable<Type>, i: number) => {
	dragInfo({ index: i, x: 0, y: 0, element: null!, height: 0 });
	updateDragPosition(event);
	event.dataTransfer?.setData("application/json", JSON.stringify(value()[i]));
	removeDragImage(event);
};

const onDragEnd = () => {
	dragInfo(undefined);
};

export default function ({ value }: Props) {
	return (
		<div class="ListWidget Voby">
			<span class="title">list</span>
			<ol>
				{() =>
					value().map((item, i) => (
						<li
							ref={(el) => {
								const dragInfo_ = dragInfo();
								if (i === dragInfo_?.index) {
									dragInfo({
										...dragInfo_,
										element: el,
										height: el.getBoundingClientRect().height,
									});
								}
							}}
							class={() => ({ dragging: i === dragInfo()?.index })}
							draggable="true"
							onDrag={(event) => {
								event.stopPropagation();
								onDrag(event, value);
							}}
							onDragStart={(event) => {
								event.stopPropagation();
								onDragStart(event, value, i);
							}}
							onDragEnd={(event) => {
								event.stopPropagation();
								onDragEnd();
							}}
						>
							<div class="drag-handle">
								<svg viewBox="0 0 1 1" height="16" width="16">
									<path
										d="M.2.35L.8.35ZM.2.65L.8.65"
										stroke="lch(100 0 0 / 0.2)"
										stroke-width="0.15"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<Widget
								value={observable(
									() => item,
									(newItem) => {
										const result = [...value()];
										result[i] = newItem;
										value(result);
									},
								)}
							/>
						</li>
					))
				}
			</ol>
			{/* FIXME: styling, also consider the UX of adding a new widget. */}
			{/* TODO: be able to change widget types, for any subtree, at all times, on the fly */}
			<button type="button" onClick={() => value((value) => [...value, null])}>
				+
			</button>
			<div class="drop-area"></div>
			{() => {
				const dragInfo_ = dragInfo();
				return (
					dragInfo_ && (
						<Portal mount={document.body}>
							<div
								class="ListWidgetDraggedItem"
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
								<Widget
									value={observable(
										() => value()[dragInfo_.index],
										(newItem) => {
											const newValue = [...value()];
											newValue[dragInfo_.index] = newItem;
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
@scope (.ListWidget) to (.Voby > *) {
	li > * {
		pointer-events: auto;
	}
}

@scope (.ListWidget) to (.Voby) {
	:scope {
		display: flex;
		flex-flow: column;
		border: 1px solid lch(100% 0 0 / 45%);
		border-radius: 4px;
		padding: 4px;
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

	li {
		display: flex;
		pointer-events: none;
	}

	button {
		background: lch(100% 0 0 / 10%);
		border-radius: 4px;
		width: 16px;
		height: 16px;
		transition-property: background-color;
	}

	button:hover {
		background: lch(100% 0 0 / 20%);
	}

	.drop-area {
		height: 16px;
		border-radius: 4px;
		border: 2px dashed lch(100% 0 0 / 20%);
		margin-top: 4px;
		background-clip: padding-box;
		transition-property: background-color;
	}

	.drop-area:hover {
		background: lch(100% 0 0 / 10%);
	}

	.dragging {
		opacity: 50%;
	}

	.drag-handle {
		display: flex;
		align-items: center;
		cursor: grab;
		margin-right: 4px;
	}
}

@scope (.ListWidgetDraggedItem) to (.Voby) {
	:scope {
		display: flex;
		align-items: center;
		position: fixed;
		pointer-events: none;
		background: lch(100% 0 0 / 10%);
		padding: 4px;
		border-radius: 4px;
	}

	.drag-handle {
		display: flex;
		align-items: center;
		cursor: grab;
		margin-right: 4px;
	}
}
`;
