import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get quiz attempt detail with questions and answers
export async function GET(req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await params;

    // Get quiz attempt with full details
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
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
        quiz: {
          include: {
            content: {
              select: {
                title: true,
                section: {
                  select: {
                    title: true,
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
              include: {
                options: {
                  orderBy: {
                    order: "asc",
                  },
                },
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: attempt.id,
      student: attempt.student,
      courseId: attempt.quiz.content.section.course.id,
      courseTitle: attempt.quiz.content.section.course.title,
      sectionTitle: attempt.quiz.content.section.title,
      quizTitle: attempt.quiz.content.title,
      score: attempt.score,
      totalScore: attempt.totalScore,
      percentage: Math.round((attempt.score / attempt.totalScore) * 100),
      attemptedAt: attempt.attemptedAt,
      feedback: attempt.feedback,
      questions: attempt.quiz.questions.map((question) => {
        const studentAnswer = (attempt.answers as any)[question.id];
        const correctOption = question.options.find((opt) => opt.isCorrect);

        return {
          id: question.id,
          text: question.text,
          order: question.order,
          options: question.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
          studentAnswer: studentAnswer,
          correctAnswer: correctOption?.id,
          isCorrect: studentAnswer === correctOption?.id,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching quiz attempt detail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update feedback for quiz attempt
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await params;
    const body = await req.json();
    const { feedback } = body;

    if (!feedback || typeof feedback !== "string") {
      return NextResponse.json({ error: "Feedback is required" }, { status: 400 });
    }

    // Get quiz attempt to verify teacher owns the course
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        quiz: {
          include: {
            content: {
              include: {
                section: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
    }

    // Update feedback
    const updatedAttempt = await prisma.quizAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        feedback,
      },
    });

    return NextResponse.json({
      id: updatedAttempt.id,
      feedback: updatedAttempt.feedback,
    });
  } catch (error) {
    console.error("Error updating quiz attempt feedback:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
