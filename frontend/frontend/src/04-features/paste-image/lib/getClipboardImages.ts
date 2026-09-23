import { supportedImageTypes } from "../config/supportedImageTypes";

export const getClipboardImages = (event: ClipboardEvent): File[] => {
  if (!event.clipboardData) return [];

  return Array.from(event.clipboardData.items)
    .filter((item) => {
      return item.kind === "file" && supportedImageTypes.has(item.type);
    })
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
};