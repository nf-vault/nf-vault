import type { EditorView } from "@uiw/react-codemirror";
import { createImageSizeSource } from "./imageSize";

const MIN_IMAGE_WIDTH = 5;
const MAX_IMAGE_WIDTH = 100;

type ImageResizeConfig = {
  view: EditorView;
  container: HTMLElement;
  frame: HTMLElement;
  image: HTMLImageElement;
  handle: HTMLButtonElement;
  controls: HTMLElement;
  imageTo: number;
  decorationTo: number;
  initialWidth: number | null;
};

export const createImageResize = ({
  view,
  container,
  frame,
  image,
  handle,
  controls,
  imageTo,
  decorationTo,
  initialWidth
}: ImageResizeConfig) => {
  let active = false;
  let removeOutsideClickListener: (() => void) | null = null;
  let removeEscapeListener: (() => void) | null = null;

  const setPreviewWidth = (width: number) => {
    frame.style.width = `${width}%`;
    image.style.width = "100%";
  };

  const getWidth = (clientX: number) => {
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0) return initialWidth ?? MAX_IMAGE_WIDTH;

    const width = Math.round(
      ((clientX - containerRect.left) / containerRect.width) * 100
    );
    return Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, width));
  };

  const deactivate = () => {
    active = false;

    handle.hidden = true;
    controls.hidden = true;
    frame.classList.remove("cm-markdown-image-frame-selected");
    
    removeOutsideClickListener?.();
    removeOutsideClickListener = null;
    removeEscapeListener?.();
    removeEscapeListener = null;
  };

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    handle.setPointerCapture(event.pointerId);
    setPreviewWidth(getWidth(event.clientX));
  });

  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;
    setPreviewWidth(getWidth(event.clientX));
  });

  handle.addEventListener("pointerup", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;

    const width = getWidth(event.clientX);
    handle.releasePointerCapture(event.pointerId);
    view.dispatch({
      changes: {
        from: imageTo,
        to: decorationTo,
        insert: createImageSizeSource(width)
      }
    });
  });

  handle.addEventListener("pointercancel", (event) => {
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
    if (initialWidth === null) {
      frame.style.removeProperty("width");
      image.style.removeProperty("width");
    } else {
      setPreviewWidth(initialWidth);
    }
    deactivate();
  });

  return {
    activate() {
      if (active) return;

      active = true;
      handle.hidden = false;
      controls.hidden = false;
      frame.classList.add("cm-markdown-image-frame-selected");

      const closeOnOutsideClick = (event: PointerEvent) => {
        if (event.target instanceof Node && frame.contains(event.target)) {
          return;
        }
        deactivate();
      };
      document.addEventListener("pointerdown", closeOnOutsideClick);
      removeOutsideClickListener = () => {
        document.removeEventListener("pointerdown", closeOnOutsideClick);
      };

      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") deactivate();
      };
      document.addEventListener("keydown", closeOnEscape);
      removeEscapeListener = () => {
        document.removeEventListener("keydown", closeOnEscape);
      };
    },
    destroy: deactivate
  };
};