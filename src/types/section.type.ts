import type { IContent } from "./content.type";

export interface ISection {
  id: number;
  title: string;
  orderIndex: number;
  contents: IContent[];
}
