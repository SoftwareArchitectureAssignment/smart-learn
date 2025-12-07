import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentReviewClient } from "@/components/student/assessment-review-client";

interface PageProps {
  params: Promise<{ pathId: string }>;
}

export default async function AssessmentReviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch learning path with courses
  const learningPath = await prisma.learningPath.findUnique({
    where: {
      id: resolvedParams.pathId,
      studentId: session.user.id,
    },
    include: {
      courses: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!learningPath) {
    redirect("/student/learning-paths");
  }

  // Fetch assessment attempt
  const assessmentAttempt = await prisma.assessmentAttempt.findUnique({
    where: {
      id: learningPath.assessmentAttemptId,
    },
  });

  if (!assessmentAttempt) {
    redirect("/student/learning-paths");
  }

  // Fetch topic
  const topic = await prisma.topic.findUnique({
    where: {
      id: assessmentAttempt.topicId,
    },
  });

  if (!topic) {
    redirect("/student/learning-paths");
  }

  // Check if learning path has courses
  const hasLearningPath = learningPath.courses.length > 0;

  // Fetch questions for this assessment
  const questions = await prisma.assessmentQuestion.findMany({
    where: {
      topics: {
        some: {
          topicId: assessmentAttempt.topicId,
        },
      },
    },
    include: {
      options: true,
    },
    take: assessmentAttempt.totalQuestions,
  });

  // Fetch all courses in the system
  const allCourses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
  });

  return (
    <AssessmentReviewClient
      learningPath={{
        id: learningPath.id,
        title: learningPath.title,
        assessmentAttempt: {
          id: assessmentAttempt.id,
          score: assessmentAttempt.score,
          totalScore: assessmentAttempt.totalScore,
          totalQuestions: assessmentAttempt.totalQuestions,
          answers: assessmentAttempt.answers as Record<string, string>,
          topicId: assessmentAttempt.topicId,
          topicName: topic.name,
        },
      }}
      questions={questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      }))}
      allCourses={allCourses}
      hasLearningPath={hasLearningPath}
    />
  );
}
