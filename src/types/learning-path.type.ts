import type { ICourse } from "./course.type";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string; // e.g., "3 months"
  courses: ICourse[];
  totalCourses: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementTest {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  numberOfQuestions: number;
  timeLimit: number; // in minutes
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface TestConfig {
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  numberOfQuestions: number;
  timeLimit: number;
}

export interface TestResult {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  feedback: string;
  recommendedPaths: LearningPath[];
  completedAt: string;
}

export interface StudentProgress {
  courseId: string;
  courseName: string;
  progress: number; // percentage
  lastAccessed: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}
