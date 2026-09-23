import { request } from "../request";
import { API_V1_PATH } from "../config";

type createDocumentReq = {
  name: string
  type: string
  parentId?: number | null
}
type createDocumentRes = number

export const createDocument = async (
  {
    name,
    type,
    parentId = null,
  }: createDocumentReq
): Promise<createDocumentRes> => {
  const data = await request<{ docId: number }>(`${API_V1_PATH}/document/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      type: type,
      parentId: parentId
    })
  });

  return data.docId;
};
