import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; studentId: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, studentId } = await params;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Verify student is enrolled
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student not enrolled in this course" },
        { status: 404 }
      );
    }

    // Get all quizzes in this course
    const quizzes = await prisma.quiz.findMany({
      where: {
        content: {
          section: {
            courseId,
          },
        },
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            section: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Get all attempts for each quiz
    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await prisma.quizAttempt.findMany({
          where: {
            quizId: quiz.id,
            studentId,
          },
          orderBy: {
            attemptedAt: "desc",
          },
        });

        const attemptStats = attempts.map((attempt) => ({
          id: attempt.id,
          score: attempt.score,
          totalScore: attempt.totalScore,
          percentage: Math.round((attempt.score / attempt.totalScore) * 100),
          attemptedAt: attempt.attemptedAt,
          feedback: attempt.feedback,
        }));

        return {
          quizId: quiz.id,
          quizTitle: quiz.content.title,
          sectionTitle: quiz.content.section.title,
          totalAttempts: attempts.length,
          averageScore:
            attempts.length > 0
              ? Math.round(
                  (attempts.reduce(
                    (sum, a) => sum + (a.score / a.totalScore) * 100,
                    0
                  ) /
                    attempts.length) *
                    100
                ) / 100
              : 0,
          bestScore:
            attempts.length > 0
              ? Math.max(
                  ...attempts.map((a) => (a.score / a.totalScore) * 100)
                )
              : 0,
          attempts: attemptStats,
        };
      })
    );

    return NextResponse.json({
      student: enrollment.student,
      enrolledAt: enrollment.enrolledAt,
      quizzes: quizzesWithAttempts.filter((q) => q.totalAttempts > 0),
    });
  } catch (error) {
    console.error("Error fetching student quiz attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
