import type { DecorationProvider } from "../types";
import { getCodeBlockDecorations } from "../providers/codeBlock/getCodeBlockDecorations";
import { getImageDecorations } from "../providers/image/getImageDecorations";
import { getMarkerDecorations } from "../providers/marker/getMarkerDecorations";

export const decorationProviders: readonly DecorationProvider[] = [
  getCodeBlockDecorations,
  getImageDecorations,
  getMarkerDecorations
];