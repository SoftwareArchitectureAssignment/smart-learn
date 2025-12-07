import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizAttemptsClient } from "@/components/student/quiz-attempts-client";

async function getQuizAttemptsData(quizId: string, studentId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
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
      attempts: {
        where: {
          studentId,
        },
        orderBy: {
          attemptedAt: "desc",
        },
      },
    },
  });

  if (!quiz) {
    return null;
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: quiz.content.section.course.id,
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  return quiz;
}

export default async function QuizAttemptsPage({ params }: { params: Promise<{ quizId: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "student") {
    redirect("/login");
  }

  const { quizId } = await params;
  const quiz = await getQuizAttemptsData(quizId, session.user.id);

  if (!quiz) {
    redirect("/student/courses");
  }

  return <QuizAttemptsClient quiz={quiz} />;
}
