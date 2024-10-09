type FunctionMaybe<T> = (() => T) | T;
type ArrayMaybe<T> = readonly T[] | T;
type FN<Arguments extends readonly unknown[], Return extends unknown> = (
	...args: Arguments
) => Return;
type Disposer = () => void;

declare module "voby" {
	function useEventListener<T extends keyof WindowEventMap>(
		target: FunctionMaybe<ArrayMaybe<Window | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[WindowEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof DocumentEventMap>(
		target: FunctionMaybe<ArrayMaybe<Document | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[DocumentEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof HTMLBodyElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<HTMLBodyElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[HTMLBodyElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof HTMLFrameSetElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<HTMLFrameSetElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[HTMLFrameSetElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof HTMLMediaElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<HTMLMediaElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[HTMLMediaElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof HTMLVideoElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<HTMLVideoElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[HTMLVideoElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof HTMLElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<HTMLElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[HTMLElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SVGSVGElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<SVGSVGElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SVGSVGElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SVGElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<SVGElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SVGElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MathMLElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<MathMLElement | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MathMLElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ElementEventMap>(
		target: FunctionMaybe<ArrayMaybe<Element | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ElementEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AbortSignalEventMap>(
		target: FunctionMaybe<ArrayMaybe<AbortSignal | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AbortSignalEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AbstractWorkerEventMap>(
		target: FunctionMaybe<ArrayMaybe<AbstractWorker | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AbstractWorkerEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AnimationEventMap>(
		target: FunctionMaybe<ArrayMaybe<Animation | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AnimationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof BroadcastChannelEventMap>(
		target: FunctionMaybe<ArrayMaybe<BroadcastChannel | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[BroadcastChannelEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AnimationEventMap>(
		target: FunctionMaybe<ArrayMaybe<CSSAnimation | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AnimationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AnimationEventMap>(
		target: FunctionMaybe<ArrayMaybe<CSSTransition | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AnimationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof FileReaderEventMap>(
		target: FunctionMaybe<ArrayMaybe<FileReader | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[FileReaderEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof IDBDatabaseEventMap>(
		target: FunctionMaybe<ArrayMaybe<IDBDatabase | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[IDBDatabaseEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof IDBOpenDBRequestEventMap>(
		target: FunctionMaybe<ArrayMaybe<IDBOpenDBRequest | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[IDBOpenDBRequestEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof IDBRequestEventMap>(
		target: FunctionMaybe<ArrayMaybe<IDBRequest | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[IDBRequestEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof IDBTransactionEventMap>(
		target: FunctionMaybe<ArrayMaybe<IDBTransaction | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[IDBTransactionEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaDevicesEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaDevices | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaDevicesEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaKeySessionEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaKeySession | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaKeySessionEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaQueryListEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaQueryList | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaQueryListEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaRecorderEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaRecorder | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaRecorderEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaSourceEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaSource | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaSourceEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaStreamEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaStream | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaStreamEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MediaStreamTrackEventMap>(
		target: FunctionMaybe<ArrayMaybe<MediaStreamTrack | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MediaStreamTrackEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof MessagePortEventMap>(
		target: FunctionMaybe<ArrayMaybe<MessagePort | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[MessagePortEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof NotificationEventMap>(
		target: FunctionMaybe<ArrayMaybe<Notification | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[NotificationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof PaymentRequestEventMap>(
		target: FunctionMaybe<ArrayMaybe<PaymentRequest | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[PaymentRequestEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof PerformanceEventMap>(
		target: FunctionMaybe<ArrayMaybe<Performance | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[PerformanceEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof PermissionStatusEventMap>(
		target: FunctionMaybe<ArrayMaybe<PermissionStatus | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[PermissionStatusEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof PictureInPictureWindowEventMap>(
		target: FunctionMaybe<ArrayMaybe<PictureInPictureWindow | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[PictureInPictureWindowEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof RemotePlaybackEventMap>(
		target: FunctionMaybe<ArrayMaybe<RemotePlayback | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[RemotePlaybackEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ScreenOrientationEventMap>(
		target: FunctionMaybe<ArrayMaybe<ScreenOrientation | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ScreenOrientationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ServiceWorkerEventMap>(
		target: FunctionMaybe<ArrayMaybe<ServiceWorker | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ServiceWorkerEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ServiceWorkerContainerEventMap>(
		target: FunctionMaybe<ArrayMaybe<ServiceWorkerContainer | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ServiceWorkerContainerEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ServiceWorkerRegistrationEventMap>(
		target: FunctionMaybe<ArrayMaybe<ServiceWorkerRegistration | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ServiceWorkerRegistrationEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof ShadowRootEventMap>(
		target: FunctionMaybe<ArrayMaybe<ShadowRoot | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[ShadowRootEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof AbstractWorkerEventMap>(
		target: FunctionMaybe<ArrayMaybe<SharedWorker | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[AbstractWorkerEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SourceBufferEventMap>(
		target: FunctionMaybe<ArrayMaybe<SourceBuffer | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SourceBufferEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SourceBufferListEventMap>(
		target: FunctionMaybe<ArrayMaybe<SourceBufferList | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SourceBufferListEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SpeechSynthesisEventMap>(
		target: FunctionMaybe<ArrayMaybe<SpeechSynthesis | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SpeechSynthesisEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof SpeechSynthesisUtteranceEventMap>(
		target: FunctionMaybe<ArrayMaybe<SpeechSynthesisUtterance | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[SpeechSynthesisUtteranceEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof VisualViewportEventMap>(
		target: FunctionMaybe<ArrayMaybe<VisualViewport | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[VisualViewportEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof WebSocketEventMap>(
		target: FunctionMaybe<ArrayMaybe<WebSocket | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[WebSocketEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof WorkerEventMap>(
		target: FunctionMaybe<ArrayMaybe<Worker | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[WorkerEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof DocumentEventMap>(
		target: FunctionMaybe<ArrayMaybe<XMLDocument | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[DocumentEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof XMLHttpRequestEventMap>(
		target: FunctionMaybe<ArrayMaybe<XMLHttpRequest | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[XMLHttpRequestEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof XMLHttpRequestEventTargetEventMap>(
		target: FunctionMaybe<ArrayMaybe<XMLHttpRequestEventTarget | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[XMLHttpRequestEventTargetEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof XMLHttpRequestEventTargetEventMap>(
		target: FunctionMaybe<ArrayMaybe<XMLHttpRequestUpload | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[XMLHttpRequestEventTargetEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
	function useEventListener<T extends keyof EventSourceEventMap>(
		target: FunctionMaybe<ArrayMaybe<EventSource | undefined>>,
		event: FunctionMaybe<T>,
		handler: FN<[EventSourceEventMap[T]], void>,
		options?: FunctionMaybe<true | AddEventListenerOptions>,
	): Disposer;
}
