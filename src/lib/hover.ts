import { type TargetsParam } from "animejs";
import { $ } from "animejs/utils";

export function isValidHover(event: PointerEvent) {
  return event.pointerType !== "touch";
}

type OnHoverStartEvent = (
  element: Element,
  event: PointerEvent,
) => void | OnHoverEndEvent;
type OnHoverEndEvent = (event: PointerEvent) => void;
type EventOptions = {
  // Use passive event listeners
  passive?: boolean;
  // Remove the event listener after the first event
  once?: boolean;
};

export function hover(
  targets: TargetsParam,
  onHoverStart: OnHoverStartEvent,
  options: EventOptions = {},
) {
  const elements = $(targets);
  const gestureAbortController = new AbortController();
  const eventOptions: AddEventListenerOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal,
  };
  const cancel = () => gestureAbortController.abort();

  const onPointerEnter = (enterEvent: PointerEvent) => {
    if (!isValidHover(enterEvent)) return;

    const { target } = enterEvent;
    const onHoverEnd = onHoverStart(target as Element, enterEvent);

    if (typeof onHoverEnd !== "function" || !target) return;

    const onPointerLeave = (leaveEvent: PointerEvent) => {
      if (!isValidHover(leaveEvent)) return;

      onHoverEnd(leaveEvent);
      target.removeEventListener(
        "pointerleave",
        onPointerLeave as EventListener,
      );
    };

    target.addEventListener(
      "pointerleave",
      onPointerLeave as EventListener,
      eventOptions,
    );
  };

  elements.forEach((element) => {
    element.addEventListener(
      "pointerenter",
      onPointerEnter as EventListener,
      eventOptions,
    );
  });

  return cancel;
}
