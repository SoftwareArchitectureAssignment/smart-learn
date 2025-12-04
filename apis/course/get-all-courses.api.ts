import api from "@/lib/api";

interface IResponse {
  success: boolean;
  status: number;
  data: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

export async function getAllCoursesApi() {
  const res = await api.get<IResponse>("courses");
  return {
    ...res.data.data,
    sections: [],
  };
}
