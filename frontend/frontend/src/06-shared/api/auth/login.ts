import { request } from "../request";
import { API_V1_PATH } from "../config";

type loginReq = {
  login: string
  password: string
}
type loginRes = {}

export const login = async (
  {
    login,
    password
  }: loginReq
): Promise<loginRes> => {
  await request(`${API_V1_PATH}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: password
    })
  });

  return true;
};