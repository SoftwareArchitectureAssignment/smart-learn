export interface CourseMemberStudent {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface CourseMemberQuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
}

export interface CourseMemberRecentAttempt {
  id: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
}

export interface CourseMember {
  student: CourseMemberStudent;
  enrolledAt: string;
  quizStats: CourseMemberQuizStats;
  recentAttempts: CourseMemberRecentAttempt[];
}

export interface StudentQuizAttemptDetail {
  id: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
}

export interface StudentQuizWithAttempts {
  quizId: string;
  quizTitle: string;
  sectionTitle: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  attempts: StudentQuizAttemptDetail[];
}

export interface StudentQuizData {
  student: CourseMemberStudent;
  enrolledAt: string;
  quizzes: StudentQuizWithAttempts[];
}

export interface QuizAttemptQuestion {
  id: string;
  text: string;
  order: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizAttemptDetailData {
  id: string;
  student: CourseMemberStudent;
  courseId: string;
  courseTitle: string;
  sectionTitle: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
  questions: QuizAttemptQuestion[];
}
