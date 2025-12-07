import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFeedbackApi } from "@/apis/ai/get-feedback.api";

// Generate AI feedback for quiz attempt using external AI service
export async function POST(req: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await params;

    // Get quiz attempt to verify teacher owns the course
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        quiz: {
          include: {
            content: {
              select: {
                title: true,
                section: {
                  select: {
                    course: true,
                  },
                },
              },
            },
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
    }

    // Calculate score percentage
    const percentage = Math.round((attempt.score / attempt.totalScore) * 100);
    const answers = attempt.answers as Record<string, string>;

    // Build detailed question analysis
    const questionAnalysis = attempt.quiz.questions.map((question, index) => {
      const selectedOptionId = answers[question.id];
      const correctOption = question.options.find((opt) => opt.isCorrect);
      const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
      const isCorrect = selectedOptionId === correctOption?.id;

      return {
        questionNumber: index + 1,
        questionText: question.text,
        selectedAnswer: selectedOption?.text || "No answer",
        correctAnswer: correctOption?.text || "N/A",
        isCorrect,
      };
    });

    // Create a comprehensive question for the AI
    const aiQuestion = `Evaluate this student's quiz performance and provide detailed, constructive feedback:

Student: ${attempt.student.name}
Quiz: ${attempt.quiz.content.title}
Score: ${attempt.score}/${attempt.totalScore} (${percentage}%)
Total Questions: ${attempt.quiz.questions.length}
Correct Answers: ${attempt.score}

Question Analysis:
${questionAnalysis
  .map(
    (q) => `
Question ${q.questionNumber}: ${q.questionText}
- Student's Answer: ${q.selectedAnswer}
- Correct Answer: ${q.correctAnswer}
- Result: ${q.isCorrect ? "✓ Correct" : "✗ Incorrect"}
`,
  )
  .join("\n")}

Please provide:
1. Overall performance assessment
2. Specific strengths based on correct answers
3. Areas needing improvement based on incorrect answers
4. Actionable study recommendations
5. Encouraging message

Format the feedback in Vietnamese with clear sections and emojis for better readability.`;

    // Call external AI service
    const aiResponse = await getFeedbackApi({
      question: aiQuestion,
      question_uid: attemptId,
    });

    return NextResponse.json({
      id: attemptId,
      feedback: aiResponse.answer,
      aiMetadata: {
        timestamp: aiResponse.timestamp,
        modelName: aiResponse.model_name,
      },
    });
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI feedback. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
