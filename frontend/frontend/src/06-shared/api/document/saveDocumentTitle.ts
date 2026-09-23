import { request } from "../request";
import { API_V1_PATH } from "../config";

type saveDocumentTitleReq = {
  title: string
  docId: number
}
type saveDocumentTitleRes = {}

export const saveDocumentTitle = async (
  {
    title,
    docId
  }: saveDocumentTitleReq
): Promise<saveDocumentTitleRes> => {
  await request(`${API_V1_PATH}/document/${docId}/title`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title ?? "",
    })
  });

  return {}
}
