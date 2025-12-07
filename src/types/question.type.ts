export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface IQuestionOption {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: number;
  content: string;
  type: QuestionType;
  points: number;
  options?: IQuestionOption[]; // For MULTIPLE_CHOICE and TRUE_FALSE
  correctAnswer?: string; // For SHORT_ANSWER
  explanation?: string;
}
