import { useEffect, useState } from "react";
import { searchDocuments, type SearchDocumentResult } from "@/06-shared/api";
import { useDebounce } from "@/06-shared/lib/useDebounce";
import {
  SEARCH_DEBOUNCE_DELAY,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_RESULTS_LIMIT
} from "../config";

type SearchState = {
  query: string
  results: SearchDocumentResult[]
  isLoading: boolean
  hasError: boolean
};

const initialState: SearchState = {
  query: "",
  results: [],
  isLoading: false,
  hasError: false
};

export const useSearchSuggestions = (query: string) => {
  const normalizedQuery = query.trim();
  const debouncedQuery = useDebounce(normalizedQuery, SEARCH_DEBOUNCE_DELAY);
  const [state, setState] = useState<SearchState>(initialState);

  useEffect(() => {
    if (debouncedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
      setState(initialState);
      return;
    }

    const abortController = new AbortController();
    setState({
      query: debouncedQuery,
      results: [],
      isLoading: true,
      hasError: false
    });

    searchDocuments({
      query: debouncedQuery,
      limit: SEARCH_RESULTS_LIMIT,
      signal: abortController.signal
    })
      .then((results) => {
        setState({
          query: debouncedQuery,
          results,
          isLoading: false,
          hasError: false
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;

        setState({
          query: debouncedQuery,
          results: [],
          isLoading: false,
          hasError: true
        });
      });

    return () => abortController.abort();
  }, [debouncedQuery]);

  const hasQuery = normalizedQuery.length >= SEARCH_MIN_QUERY_LENGTH;
  const isCurrentQuery = state.query === normalizedQuery;

  return {
    results: isCurrentQuery ? state.results : [],
    isLoading: hasQuery && (!isCurrentQuery || state.isLoading),
    hasError: isCurrentQuery && state.hasError,
    hasQuery
  };
};