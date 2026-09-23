import { useCallback, useId, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import type { SearchDocumentResult } from "@/06-shared/api";
import { useOutsideClick } from "@/06-shared/lib/useOutsideClick";
import { SEARCH_MIN_QUERY_LENGTH } from "../config";
import { useSearchSuggestions } from "../model/useSearchSuggestions";
import { SearchResults } from "./SearchResults";
import styles from "./index.module.css";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const resultsId = useId();
  const { results, isLoading, hasError, hasQuery } = useSearchSuggestions(query);
  const closeResults = useCallback(() => setIsOpen(false), []);
  const containerRef = useOutsideClick<HTMLDivElement>(closeResults);

  const openResult = (result: SearchDocumentResult) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/${result.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => index <= 0 ? results.length - 1 : index - 1);
    }

    const selectedResult = results[selectedIndex];
    if (event.key === "Enter" && selectedResult) {
      event.preventDefault();
      openResult(selectedResult);
    }
  };

  const selectedResult = results[selectedIndex];
  const activeResultId = selectedResult
    ? `${resultsId}-option-${selectedResult.id}`
    : undefined;
  const areResultsVisible = isOpen && hasQuery && !isLoading;

  return (
    <div className={styles.search} ref={containerRef}>
      <span className={styles.prompt} aria-hidden="true">/</span>
      <input
        className={styles.input}
        type="search"
        role="combobox"
        value={query}
        placeholder="search documents"
        autoComplete="off"
        aria-label="Search documents"
        aria-autocomplete="list"
        aria-expanded={areResultsVisible}
        aria-controls={areResultsVisible ? resultsId : undefined}
        aria-activedescendant={areResultsVisible ? activeResultId : undefined}
        aria-busy={isLoading}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedIndex(-1);
          setIsOpen(event.target.value.trim().length >= SEARCH_MIN_QUERY_LENGTH);
        }}
        onFocus={() => {
          if (hasQuery) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />

      {isLoading && <span className={styles.status} aria-hidden="true">...</span>}

      {areResultsVisible && (
        <SearchResults
          id={resultsId}
          results={results}
          selectedIndex={selectedIndex}
          hasError={hasError}
          onSelect={openResult}
          onHighlight={setSelectedIndex}
        />
      )}
    </div>
  );
};