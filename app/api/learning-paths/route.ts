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
