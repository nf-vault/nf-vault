import { request } from "../request";
import { API_V1_PATH } from "../config";

type deleteDocumentReq = {
  docId: number
}
type deleteDocumentRes = {}

export const deleteDocument = async ({
  docId,
}: deleteDocumentReq): Promise<deleteDocumentRes> => {
  await request(`${API_V1_PATH}/document/${docId}`, {
    method: "DELETE",
  });
  return {};
};