import api from "@/lib/api";

interface IRequest {
  file: File;
}

interface IResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    key: string;
    url: string;
    bucket: string;
    size: number;
    mimetype: string;
  };
}

export async function uploadSingleApi({ file }: IRequest) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<IResponse>(import.meta.env.VITE_UPLOAD_BASE_URL + "/upload/single", {
    header: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
    body: formData,
  });

  return res.data;
}
