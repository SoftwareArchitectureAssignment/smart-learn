import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizAttemptDetailClient } from "@/components/student/quiz-attempt-detail-client";

async function getAttemptDetail(attemptId: string, studentId: string) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        include: {
          content: {
            select: {
              title: true,
              section: {
                select: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
          questions: {
            orderBy: { order: "asc" },
            include: {
              options: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt || attempt.studentId !== studentId) {
    return null;
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: attempt.quiz.content.section.course.id,
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  return attempt;
}

export default async function QuizAttemptDetailPage({
  params,
}: {
  params: Promise<{ quizId: string; attemptId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "student") {
    redirect("/login");
  }

  const { attemptId } = await params;
  const attempt = await getAttemptDetail(attemptId, session.user.id);

  if (!attempt) {
    redirect("/student/courses");
  }

  return <QuizAttemptDetailClient attempt={attempt} />;
}
