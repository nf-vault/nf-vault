import { request } from "../request";
import { API_V1_PATH } from "../config";

type loginReq = {}
type loginRes = {}

export const validate = async (
  {}: loginReq
): Promise<loginRes> => {
  await request(`${API_V1_PATH}/auth/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });

  return true;
};