export type SyntaxNodeRange = {
  from: number;
  to: number;
};

export type MarkdownSyntaxNode = SyntaxNodeRange & {
  name: string;
  node: {
    parent: (SyntaxNodeRange & { name: string }) | null;
    getChild: (name: string) => SyntaxNodeRange | null;
    getChildren: (name: string) => SyntaxNodeRange[];
  };
};