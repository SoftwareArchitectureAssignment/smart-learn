import api from "@/lib/api";
import type { IUser } from "@/types/user.type";

interface IRequest {
  email?: string;
  name?: string;
  password?: string;
  phoneNumber?: string;
  role?: string;
}

interface IResponse {
  status: number;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
  };
}

function toUser(data: IResponse): IUser {
  return {
    id: data.data.id,
    email: data.data.email,
    name: data.data.name,
    phone: data.data.phoneNumber,
    role: data.data.role,
  };
}

export async function updateProfileApi(payload: IRequest) {
  const res = await api.put<IResponse>("users/me", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
