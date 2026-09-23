import { request } from "../request";
import { API_V1_PATH } from "../config";

export type DocumentListItem = {
  id: number
  type: "document" | "directory" | string
  title: string
  parentId: number | null
}

type getDocumentsRes = DocumentListItem[]

type getDocumentsReq = {
  parentId?: number | null
}

export const getDocuments = async ({
  parentId = null,
}: getDocumentsReq = {}): Promise<getDocumentsRes> => {
  const searchParams = new URLSearchParams();
  if (parentId !== null) {
    searchParams.set("parentId", String(parentId));
  }

  const query = searchParams.toString();

  return request<getDocumentsRes>(`${API_V1_PATH}/document${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};
