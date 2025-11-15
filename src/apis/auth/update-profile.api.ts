import api from "@/lib/api";

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
    user: {
      id: number;
      email: string;
      name: string;
      phoneNumber: string;
      role: "STUDENT" | "TEACHER" | "ADMIN";
    };
  };
}

export function updateProfileApi(payload: IRequest) {
  return api.safeExec<IResponse>({ method: "PUT", url: "users", data: payload }, () => ({
    status: 200,
    message: "User registered successfully",
    data: {
      user: {
        id: 3,
        email: "nva@gmail.com",
        name: "Nguyen Van A",
        phoneNumber: "0123456789",
        role: "TEACHER",
      },
    },
  }));
}
