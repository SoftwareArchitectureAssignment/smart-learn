import api from "@/lib/api";
import type { IUser } from "@/types/user.type";

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

export async function authApi() {
  const res = await api.get<IResponse>("users/me");

  return {
    ...res.data,
    toUser: () => toUser(res.data),
  };
}
