import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { topicId, answers } = body;

    if (!topicId || !answers) {
      return NextResponse.json({ error: "Topic ID and answers are required" }, { status: 400 });
    }

    // Fetch all questions with their correct answers
    const questionIds = Object.keys(answers);
    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        options: true,
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    // Calculate score and prepare detailed results
    let score = 0;
    const totalScore = questions.length;
    const detailedResults = questions.map((question) => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find((opt) => opt.isCorrect);
      const isCorrect = correctOption && userAnswer === correctOption.id;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question.id,
        questionText: question.text,
        userAnswerId: userAnswer,
        correctAnswerId: correctOption?.id,
        isCorrect,
        options: question.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      };
    });

    // Create assessment attempt
    const assessmentAttempt = await prisma.assessmentAttempt.create({
      data: {
        studentId: user.id,
        topicId: topicId,
        totalQuestions: questions.length,
        score: score,
        totalScore: totalScore,
        answers: answers,
      },
    });

    // Generate learning path based on score
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    const percentage = (score / totalScore) * 100;
    let learningPathTitle = "";
    let learningPathDescription = "";

    if (percentage >= 80) {
      learningPathTitle = `Advanced ${topic?.name} Path`;
      learningPathDescription = `You've demonstrated strong knowledge in ${topic?.name}. This path will help you master advanced concepts.`;
    } else if (percentage >= 60) {
      learningPathTitle = `Intermediate ${topic?.name} Path`;
      learningPathDescription = `Build upon your existing ${topic?.name} knowledge with intermediate-level courses.`;
    } else {
      learningPathTitle = `Beginner ${topic?.name} Path`;
      learningPathDescription = `Start your journey in ${topic?.name} with foundational courses designed for beginners.`;
    }

    // Fetch courses related to this topic
    const relatedCourses = await prisma.course.findMany({
      where: {
        topics: {
          some: {
            topicId: topicId,
          },
        },
      },
      take: 5, // Recommend up to 5 courses
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        assessmentAttemptId: assessmentAttempt.id,
        studentId: user.id,
        title: learningPathTitle,
        description: learningPathDescription,
        status: "NOT_STARTED",
        courses: {
          create: relatedCourses.map((course, index) => ({
            courseId: course.id,
            order: index + 1,
            reason:
              percentage >= 80
                ? `Advanced techniques and best practices in ${topic?.name}`
                : percentage >= 60
                  ? `Strengthen your intermediate skills`
                  : `Essential fundamentals for beginners`,
          })),
        },
      },
      include: {
        courses: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: assessmentAttempt.id,
      score,
      totalScore,
      totalQuestions: questions.length,
      percentage: Math.round(percentage),
      detailedResults,
      learningPath: {
        id: learningPath.id,
        title: learningPath.title,
        coursesCount: learningPath.courses.length,
      },
    });
  } catch (error) {
    console.error("Error creating assessment attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
