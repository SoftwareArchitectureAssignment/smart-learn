export interface IUser {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  accessToken?: string;
}
