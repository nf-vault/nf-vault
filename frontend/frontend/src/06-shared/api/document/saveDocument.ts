import { request } from "../request";
import { API_V1_PATH } from "../config";

type saveDocumentReq = {
  content: string
  docId: number
}
type saveDocumentRes = {}

export const saveDocument = async (
  {
    content,
    docId
  }: saveDocumentReq
): Promise<saveDocumentRes> => {
  await request(`${API_V1_PATH}/document/${docId}/content`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content ?? "",
    })
  });

  return {}
}
