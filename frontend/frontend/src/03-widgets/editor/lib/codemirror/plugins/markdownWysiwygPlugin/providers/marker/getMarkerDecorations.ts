import { highlightingFor } from "@codemirror/language";
import { Decoration } from "@uiw/react-codemirror";
import type { EditorView } from "@uiw/react-codemirror";
import type { Tag } from "@lezer/highlight";
import { getImageSize } from "@/04-features/edit-image";
import { markdownSourceMarkerTag } from "../../../../themes";
import type { DecorationProvider, MarkdownSyntaxNode } from "../../types";
import { isSelectionInside } from "../../util/isSelectionInside";
import { MarkdownMarkerWidget } from "./MarkdownMarkerWidget";
import { markerRules, type MarkerReplacementResolver } from "./markerRules";

const getMarkerContext = (node: MarkdownSyntaxNode) => {
  const rule = markerRules[node.name];
  const owner = node.node.parent;

  if (!rule || !owner || !rule.ownerNames.includes(owner.name)) {
    return null;
  }

  return { owner, rule };
};

const getHighlightClass = (view: EditorView, tag: Tag) => {
  return highlightingFor(view.state, [tag]) ?? "";
};

const getMarkerReplacement = (
  view: EditorView,
  node: MarkdownSyntaxNode,
  replacementResolver?: MarkerReplacementResolver,
) => {
  if (!replacementResolver) return Decoration.replace({});

  const sourceMarker = view.state.doc.sliceString(node.from, node.to);
  const widgetText = replacementResolver(sourceMarker);
  const className = getHighlightClass(view, markdownSourceMarkerTag);

  return Decoration.replace({
    widget: new MarkdownMarkerWidget(widgetText, className)
  });
};

const getMarkerEnd = (
  view: EditorView,
  node: MarkdownSyntaxNode,
  consumesSeparator = false
) => {
  if (
    consumesSeparator
    && /^[ \t]$/.test(view.state.doc.sliceString(node.to, node.to + 1))
  ) {
    return node.to + 1;
  }

  return node.to;
};

export const getMarkerDecorations: DecorationProvider = (view, node) => {
  const marker = getMarkerContext(node);
  if (!marker || node.from >= node.to) return { decorations: [] };

  const ownerTo = marker.owner.name === "Image"
    ? getImageSize(view.state, marker.owner.to)?.to ?? marker.owner.to
    : marker.owner.to;
  const isOwnerActive = isSelectionInside(view, {
    from: marker.owner.from,
    to: ownerTo
  });

  if (!isOwnerActive) {
    return {
      decorations: [
        getMarkerReplacement(
          view,
          node,
          marker.rule.replacementResolver
        ).range(
          node.from,
          getMarkerEnd(view, node, marker.rule.consumesSeparator)
        )
      ]
    };
  }

  if (!marker.rule.isSourceMarker) {
    return { decorations: [] };
  }

  return {
    decorations: [
      Decoration.mark({
        class: getHighlightClass(view, markdownSourceMarkerTag),
      }).range(node.from, node.to)
    ]
  };
};