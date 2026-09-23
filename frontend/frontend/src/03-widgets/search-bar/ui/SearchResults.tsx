import type { SearchDocumentResult } from "@/06-shared/api";
import { HighlightedSnippet } from "./HighlightedSnippet";
import styles from "./index.module.css";

type Props = {
  id: string
  results: SearchDocumentResult[]
  selectedIndex: number
  hasError: boolean
  onSelect: (result: SearchDocumentResult) => void
  onHighlight: (index: number) => void
};

export const SearchResults = ({
  id,
  results,
  selectedIndex,
  hasError,
  onSelect,
  onHighlight
}: Props) => (
  <div className={styles.results} id={id} role="listbox" aria-label="Search results">
    {hasError || results.length === 0 ? (
      <p
        className={styles.empty}
        role="option"
        aria-disabled="true"
        aria-selected={false}
      >
        {hasError ? "-- search unavailable --" : "-- no matches --"}
      </p>
    ) : results.map((result, index) => (
      <button
        className={`${styles.result} ${index === selectedIndex ? styles.selected : ""}`}
        id={`${id}-option-${result.id}`}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={index === selectedIndex}
        key={result.id}
        onMouseDown={(event) => event.preventDefault()}
        onMouseEnter={() => onHighlight(index)}
        onClick={() => onSelect(result)}
      >
        <span className={styles.title}>{result.title}</span>
        {result.snippet && <HighlightedSnippet html={result.snippet}/>}
      </button>
    ))}
  </div>
);