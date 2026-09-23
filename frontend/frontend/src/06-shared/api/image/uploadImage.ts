import { API_V1_PATH } from "../config";
import { request } from "../request";

type UploadImageResponse = {
  url: string;
};

export const uploadImage = (file: File): Promise<UploadImageResponse> => {
  const body = new FormData();
  body.append("file", file, file.name);

  return request(`${API_V1_PATH}/image`, {
    method: "POST",
    body
  });
};