import { request } from "../request";
import { API_V1_PATH } from "../config";

type getDocumentReq = {
  docId: number
}
type getDocumentRes = {
  title: string
  content: string
}

export const getDocument = async ({
  docId,
}: getDocumentReq): Promise<getDocumentRes> => {
  const document = await request<getDocumentRes>(`${API_V1_PATH}/document/${docId}`, {
    method: "GET",
  });

  return {
    title: document.title,
    content: document.content
  };
};