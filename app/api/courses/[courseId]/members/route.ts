import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get all enrollments with student info and quiz attempts
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
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
      orderBy: {
        enrolledAt: "desc",
      },
    });

    // Get quiz attempts for each student
    const studentsWithStats = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get all quizzes in this course
        const quizzes = await prisma.quiz.findMany({
          where: {
            content: {
              section: {
                courseId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        const quizIds = quizzes.map((q) => q.id);

        // Get all quiz attempts for this student in this course
        const attempts = await prisma.quizAttempt.findMany({
          where: {
            studentId: enrollment.studentId,
            quizId: {
              in: quizIds,
            },
          },
          include: {
            quiz: {
              include: {
                content: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
          orderBy: {
            attemptedAt: "desc",
          },
        });

        // Calculate stats
        const totalAttempts = attempts.length;
        const averageScore =
          totalAttempts > 0
            ? attempts.reduce((sum, attempt) => {
                return sum + (attempt.score / attempt.totalScore) * 100;
              }, 0) / totalAttempts
            : 0;

        const bestScore =
          totalAttempts > 0
            ? Math.max(
                ...attempts.map(
                  (attempt) => (attempt.score / attempt.totalScore) * 100
                )
              )
            : 0;

        return {
          student: enrollment.student,
          enrolledAt: enrollment.enrolledAt,
          quizStats: {
            totalAttempts,
            averageScore: Math.round(averageScore * 100) / 100,
            bestScore: Math.round(bestScore * 100) / 100,
          },
          recentAttempts: attempts.slice(0, 5).map((attempt) => ({
            id: attempt.id,
            quizTitle: attempt.quiz.content.title,
            score: attempt.score,
            totalScore: attempt.totalScore,
            percentage: Math.round((attempt.score / attempt.totalScore) * 100),
            attemptedAt: attempt.attemptedAt,
            feedback: attempt.feedback,
          })),
        };
      })
    );

    return NextResponse.json(studentsWithStats);
  } catch (error) {
    console.error("Error fetching course members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
