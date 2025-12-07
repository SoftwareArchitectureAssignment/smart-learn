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

export async function uploadSingleApi({ file }: IRequest): Promise<IResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://object-storage.zeabur.app/upload/yeadwfd6-smart-learn/single", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`);
  }

  return res.json();
}
