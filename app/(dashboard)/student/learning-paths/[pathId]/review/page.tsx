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

  // Fetch learning path
  const learningPath = await prisma.learningPath.findUnique({
    where: {
      id: resolvedParams.pathId,
      studentId: session.user.id,
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

  return (
    <AssessmentReviewClient
      learningPath={{
        id: learningPath.id,
        title: learningPath.title,
        assessmentAttempt: {
          score: assessmentAttempt.score,
          totalScore: assessmentAttempt.totalScore,
          totalQuestions: assessmentAttempt.totalQuestions,
          answers: assessmentAttempt.answers as Record<string, string>,
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
    />
  );
}
