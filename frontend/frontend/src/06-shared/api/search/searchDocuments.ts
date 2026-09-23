import { API_V1_PATH } from "../config";
import { request } from "../request";

export type SearchDocumentResult = {
  id: number
  title: string
  snippet: string
  score: number
}

type SearchDocumentsRequest = {
  query: string
  limit?: number
  signal?: AbortSignal
}

export const searchDocuments = ({
  query,
  limit = 10,
  signal
}: SearchDocumentsRequest): Promise<SearchDocumentResult[]> => {
  const searchParams = new URLSearchParams({
    query,
    limit: String(limit)
  });

  return request<SearchDocumentResult[]>(`${API_V1_PATH}/search?${searchParams}`, {
    method: "GET",
    signal
  });
};