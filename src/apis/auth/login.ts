import api from "@/lib/api";

interface IRequest {
  email: string;
  password: string;
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

export function loginApi(payload: IRequest) {
  return api.safeExec<IResponse>({ method: "POST", url: "users/login", data: payload }, () => ({
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
      accessToken: "mocked-access-token",
    },
  }));
}
