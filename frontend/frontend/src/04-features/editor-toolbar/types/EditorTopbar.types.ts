export type MarkdownFormat = "strong" | "emphasis" | "code";

export type TopbarButtonConfig = {
  format: MarkdownFormat;
  label: string;
  title: string;
};
