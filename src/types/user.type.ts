export interface IUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}
