import type { EditorState } from "@uiw/react-codemirror";

const IMAGE_SIZE_PATTERN = /^\{width=(\d{1,3})%\}/;

export type ImageSize = {
  width: number;
  to: number;
};

export const getImageSize = (
  state: EditorState,
  imageTo: number
): ImageSize | null => {
  const suffix = state.doc.sliceString(
    imageTo,
    Math.min(state.doc.length, imageTo + 16)
  );
  const match = suffix.match(IMAGE_SIZE_PATTERN);
  if (!match) return null;

  const width = Number(match[1]);
  if (width < 1 || width > 100) return null;

  return {
    width,
    to: imageTo + match[0].length
  };
};

export const createImageSizeSource = (width: number) => {
  return `{width=${width}%}`;
};