import { Fragment, type ReactNode } from "react";

import { getVisibleSnippetParts } from "../lib/getVisibleSnippetParts";
import styles from "./index.module.css";

export const HighlightedSnippet = ({ html }: { html: string }) => {
  const content: ReactNode[] = getVisibleSnippetParts(html).map((part, index) => (
    part.highlighted ? (
      <mark className={styles.highlight} key={index}>{part.text}</mark>
    ) : (
      <Fragment key={index}>{part.text}</Fragment>
    )
  ));

  return <span className={styles.snippet}>{content}</span>;
};