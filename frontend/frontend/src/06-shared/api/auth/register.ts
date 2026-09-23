import { request } from "../request";
import { API_V1_PATH } from "../config";

type registerReq = {
  login: string
  password: string
  invite_code: string
}
type registerRes = {}

export const register = async (
  {
    login,
    password,
    invite_code
  }: registerReq
): Promise<registerRes> => {
  await request(`${API_V1_PATH}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: password,
      inviteCode: invite_code
    })
  });

  return true;
};