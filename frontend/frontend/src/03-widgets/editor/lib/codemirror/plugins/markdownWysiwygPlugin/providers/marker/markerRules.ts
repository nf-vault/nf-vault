export type MarkerReplacementResolver = (sourceMarker: string) => string;

// Represents md formatting marker
export type MarkerRule = {
  // Syntax nodes that may own this marker
  ownerNames: readonly string[];
  // Show and highlight the original marker while its owner is active
  isSourceMarker?: boolean;
  // Hide one space or tab following the marker in preview mode
  consumesSeparator?: boolean;
  // Resolves the widget text shown in preview mode
  replacementResolver?: MarkerReplacementResolver;
};

export const markerRules: Readonly<Record<string, MarkerRule>> = {
  EmphasisMark: {
    ownerNames: ["StrongEmphasis", "Emphasis"],
    isSourceMarker: true
  },
  CodeMark: {
    ownerNames: ["InlineCode", "FencedCode"],
    isSourceMarker: true
  },
  CodeInfo: {
    ownerNames: ["FencedCode"]
  },
  HeaderMark: {
    ownerNames: [
      "ATXHeading1",
      "ATXHeading2",
      "ATXHeading3",
      "ATXHeading4",
      "ATXHeading5",
      "ATXHeading6"
    ],
    isSourceMarker: true,
    consumesSeparator: true
  },
  QuoteMark: {
    ownerNames: ["Blockquote"],
    isSourceMarker: true,
    consumesSeparator: true,
    replacementResolver: () => "| "
  },
  ListMark: {
    ownerNames: ["ListItem"],
    isSourceMarker: true,
    consumesSeparator: true,
    replacementResolver: (sourceMarker) => {
      const marker = sourceMarker.trim();
      return /^\d/.test(marker) ? `${marker} ` : "- ";
    }
  },
  LinkMark: {
    ownerNames: ["Link", "Autolink", "Image"],
    isSourceMarker: true
  },
  URL: {
    ownerNames: ["Link", "Image"]
  },
  LinkTitle: {
    ownerNames: ["Link", "Image"]
  },
  LinkLabel: {
    ownerNames: ["Link"]
  }
};