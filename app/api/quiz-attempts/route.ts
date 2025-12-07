import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, answers } = await request.json();

    if (!quizId || !answers) {
      return NextResponse.json({ error: "Quiz ID and answers are required" }, { status: 400 });
    }

    // Get quiz with questions and options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const totalScore = quiz.questions.length;

    quiz.questions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find((opt) => opt.isCorrect);

      if (selectedOptionId === correctOption?.id) {
        score++;
      }
    });

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId: session.user.id,
        score,
        totalScore,
        answers,
      },
    });

    return NextResponse.json({
      id: attempt.id,
      score,
      totalScore,
      percentage: Math.round((score / totalScore) * 100),
      passed: quiz.passingScore ? (score / totalScore) * 100 >= quiz.passingScore : true,
    });
  } catch (error) {
    console.error("Quiz attempt error:", error);
    return NextResponse.json({ error: "Failed to submit quiz attempt" }, { status: 500 });
  }
}
