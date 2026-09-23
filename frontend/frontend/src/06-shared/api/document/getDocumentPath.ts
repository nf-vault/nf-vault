import { request } from "../request";
import { API_V1_PATH } from "../config";

export type DocumentPathItem = {
  id: number
  type: "document" | "directory" | string
  title: string
}

type getDocumentPathReq = {
  docId: number
}

type getDocumentPathRes = DocumentPathItem[]

export const getDocumentPath = async ({
  docId,
}: getDocumentPathReq): Promise<getDocumentPathRes> => {
  return request<getDocumentPathRes>(`${API_V1_PATH}/document/${docId}/path`, {
    method: "GET",
  });
};
