import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    // Fetch all learning paths for the user
    const learningPaths = await prisma.learningPath.findMany({
      where: {
        studentId: user.id,
      },
      include: {
        assessmentAttempt: {
          select: {
            topicId: true,
            score: true,
            totalScore: true,
            totalQuestions: true,
          },
        },
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(learningPaths);
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assessmentAttemptId, recommendations, advice, explanation } = body;

    if (!assessmentAttemptId || !recommendations || !Array.isArray(recommendations)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Verify assessment attempt belongs to user
    const assessmentAttempt = await prisma.assessmentAttempt.findUnique({
      where: { id: assessmentAttemptId },
    });

    if (!assessmentAttempt || assessmentAttempt.studentId !== user.id) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Fetch topic separately
    const topic = await prisma.topic.findUnique({
      where: { id: assessmentAttempt.topicId },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Check if learning path already exists for this assessment
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        assessmentAttemptId: assessmentAttemptId,
        studentId: user.id,
      },
    });

    // Calculate percentage for title
    const percentage = Math.round((assessmentAttempt.score / assessmentAttempt.totalScore) * 100);
    let level = "Beginner";
    if (percentage >= 80) {
      level = "Advanced";
    } else if (percentage >= 60) {
      level = "Intermediate";
    }

    let learningPath;

    if (existingPath) {
      // Update existing learning path
      // First, delete existing course associations
      await prisma.learningPathCourse.deleteMany({
        where: {
          learningPathId: existingPath.id,
        },
      });

      // Update the learning path with new data
      learningPath = await prisma.learningPath.update({
        where: {
          id: existingPath.id,
        },
        data: {
          title: `${topic.name} - ${level} Learning Path`,
          description: advice || `Personalized learning path based on your ${percentage}% assessment score.`,
          status: "NOT_STARTED",
          courses: {
            create: recommendations.map((rec: any, index: number) => ({
              courseId: rec.course_uid,
              order: index + 1,
              reason: rec.description || explanation,
              isCompleted: false,
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
    } else {
      // Create new learning path
      learningPath = await prisma.learningPath.create({
        data: {
          title: `${topic.name} - ${level} Learning Path`,
          description: advice || `Personalized learning path based on your ${percentage}% assessment score.`,
          studentId: user.id,
          assessmentAttemptId: assessmentAttemptId,
          status: "NOT_STARTED",
          courses: {
            create: recommendations.map((rec: any, index: number) => ({
              courseId: rec.course_uid,
              order: index + 1,
              reason: rec.description || explanation,
              isCompleted: false,
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
    }

    return NextResponse.json(learningPath, { status: 201 });
  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
