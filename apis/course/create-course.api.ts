import api from "@/lib/api";

interface IRequest {
  title: string;
  description: string;
}

interface IResponse {
  success: boolean;
  status: number;
  data: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
  };
}

export async function createCourseApi(payload: IRequest) {
  const res = await api.post<IResponse>("courses", payload);

  return res.data;
}
