import { RequestError, request } from "../request";
import { API_V1_PATH } from "../config";

type logoutReq = {}
type logourRes = {}

export const logout = async (
  {}: logoutReq
): Promise<logourRes> => {
  await request(`${API_V1_PATH}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  }).catch((error) => {
    if (
      error instanceof RequestError &&
      (error.status === 401 || error.status === 403)
    ) {
      return true;
    }
  });

  return true;
};
