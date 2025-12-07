import type { IQuestion } from "./question.type";

export type ContentType = "video" | "document" | "quiz";

export interface IBaseContent {
  id: number;
  title: string;
  type: ContentType;
  orderIndex: number;
}

export interface IVideoContent extends IBaseContent {
  type: "video";
  url: string;
  duration: number; // in seconds
  description?: string;
}

export interface IDocumentContent extends IBaseContent {
  type: "document";
  fileUrl: string;
  fileType: string; // 'pdf', 'docx', 'pptx', etc.
  fileSize?: number; // in bytes
  description?: string;
}

export interface IQuizContent extends IBaseContent {
  type: "quiz";
  description: string;
  durationMinutes: number;
  passingScore: number; // percentage 0-100
  questions: IQuestion[];
}

export type IContent = IVideoContent | IDocumentContent | IQuizContent;
