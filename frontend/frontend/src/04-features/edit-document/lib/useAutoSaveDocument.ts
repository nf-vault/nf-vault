import { useEffect, useRef } from "react";
import { useDebounce } from "@/06-shared/lib/useDebounce";
import { saveDocument } from "@/06-shared/api";
import { useNotifyError } from "@/06-shared/lib/useNotifyError";

type props = {
  content: string;
  documentId: number;
  debounceMs?: number;
  enabled?: boolean;
}

export const useAutoSaveDocument = (
  {
    content,
    documentId,
    debounceMs = 1000,
    enabled = true,
  }: props 
) => {
  const debouncedContent = useDebounce(content, debounceMs);
  const savedContentRef = useRef<string | null>(null);
  const documentIdRef = useRef(documentId);
  const showError = useNotifyError()

  useEffect(() => {
    if (documentIdRef.current !== documentId) {
      documentIdRef.current = documentId;
      savedContentRef.current = null;
    }

    if (!enabled) {
      savedContentRef.current = null;
      return;
    }

    if (savedContentRef.current === null) {
      savedContentRef.current = content;
      return;
    }

    if (debouncedContent === savedContentRef.current) {
      return;
    }

    const saveDoc = async () => {
      try {
        await saveDocument({
          content: debouncedContent,
          docId: documentId,
        });
        savedContentRef.current = debouncedContent;
      } catch (error) {
        showError(error);
      }
    };

    saveDoc();
  }, [debouncedContent, documentId, enabled]);
};
