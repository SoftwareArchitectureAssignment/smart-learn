import api from "@/lib/api";

interface IRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  role: string;
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

export function registerApi(payload: IRequest) {
  return api.safeExec<IResponse>({ method: "POST", url: "users/register", data: payload });
}
