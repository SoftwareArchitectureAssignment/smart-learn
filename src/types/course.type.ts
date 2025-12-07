import type { ISection } from "./section.type";

export interface ICourse {
  id: number;
  title: string;
  description: string;
  instructor?: string;
  thumbnail?: string;
  createdAt: string;
  sections: ISection[];
}
