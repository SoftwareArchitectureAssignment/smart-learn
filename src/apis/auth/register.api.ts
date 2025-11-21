import api from "@/lib/api";
import type { IUser } from "@/types/user.type";

interface IRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

interface IResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      phoneNumber: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
    };
    accessToken: string;
  };
}

function toUser(data: IResponse): IUser {
  return {
    id: data.data.user.id,
    email: data.data.user.email,
    name: data.data.user.name,
    phone: data.data.user.phoneNumber,
    role: data.data.user.role,
  };
}

export async function registerApi(payload: IRequest) {
  const res = await api.post<IResponse>("users/register", payload);

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
