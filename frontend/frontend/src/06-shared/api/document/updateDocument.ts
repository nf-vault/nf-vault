import { request } from "../request";
import { API_V1_PATH } from "../config";

type updateDocumentReq = {
  docId: number
  name?: string
  content?: string
}

type updateDocumentRes = {}

export const updateDocument = async ({
  docId,
  name,
  content,
}: updateDocumentReq): Promise<updateDocumentRes> => {
  await request(`${API_V1_PATH}/document/${docId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      content,
    }),
  });

  return {};
};