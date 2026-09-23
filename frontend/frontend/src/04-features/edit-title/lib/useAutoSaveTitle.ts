import { useEffect, useRef } from "react";
import { useDebounce } from "@/06-shared/lib/useDebounce";
import { saveDocumentTitle } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";


type props = {
  title: string;
  documentId: number;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutoSaveTitle = ({
  title,
  documentId,
  debounceMs = 1000,
  enabled = true,
}: props) => {
  const debouncedTitle = useDebounce(title, debounceMs);
  const savedTitleRef = useRef<string | null>(null);
  const documentIdRef = useRef(documentId);
  const showError = useNotifyError()

  useEffect(() => {
    if (documentIdRef.current !== documentId) {
      documentIdRef.current = documentId;
      savedTitleRef.current = null;
    }

    if (!enabled) {
      savedTitleRef.current = null;
      return;
    }

    if (savedTitleRef.current === null) {
      savedTitleRef.current = title;
      return;
    }

    if (debouncedTitle === savedTitleRef.current) {
      return;
    }

    const saveTitle = async () => {
      try {
        await saveDocumentTitle({
          title: debouncedTitle,
          docId: documentId,
        });
        savedTitleRef.current = debouncedTitle;
      } catch (error) {
        showError(error)
      }
    };

    saveTitle();
  }, [debouncedTitle, documentId, enabled]);
};
