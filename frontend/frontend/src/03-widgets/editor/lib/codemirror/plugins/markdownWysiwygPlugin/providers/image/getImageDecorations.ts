import { Decoration } from "@uiw/react-codemirror";
import { getImageSize } from "@/04-features/edit-image";
import type { DecorationProvider } from "../../types";
import { isSelectionInside } from "../../util/isSelectionInside";
import { MarkdownImageWidget } from "./MarkdownImageWidget";

const unwrapImageText = (text: string) => {
  return text.replace(/\\([\\\]])/g, "$1");
};

export const getImageDecorations: DecorationProvider = (view, node) => {
  if (node.name !== "Image") {
    return { decorations: [] };
  }

  const imageSize = getImageSize(view.state, node.to);
  const decorationTo = imageSize?.to ?? node.to;
  if (isSelectionInside(view, { from: node.from, to: decorationTo })) {
    return { decorations: [] };
  }

  const urlNode = node.node.getChild("URL");
  if (!urlNode) return { decorations: [] };

  const source = view.state.doc.sliceString(urlNode.from, urlNode.to);
  const imageSource = view.state.doc.sliceString(node.from, node.to);
  const altEnd = imageSource.indexOf("](");
  const alt = altEnd >= 0
    ? unwrapImageText(imageSource.slice(2, altEnd))
    : "image";
  const titleNode = node.node.getChild("LinkTitle");
  const titleSource = titleNode
    ? view.state.doc.sliceString(titleNode.from, titleNode.to)
    : null;
  const title = titleSource?.slice(1, -1) ?? null;

  const decoration = Decoration.replace({
    widget: new MarkdownImageWidget({
      source,
      alt,
      title,
      width: imageSize?.width ?? null,
      imageFrom: node.from,
      imageTo: node.to,
      decorationTo
    })
  });

  return {
    decorations: [decoration.range(node.from, decorationTo)],
    skipChildren: true
  };
};