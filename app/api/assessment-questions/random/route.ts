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

    const searchParams = request.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const count = parseInt(searchParams.get("count") || "10");

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    // Fetch random questions for the selected topic
    const allQuestions = await prisma.assessmentQuestion.findMany({
      where: {
        topics: {
          some: {
            topicId: topicId,
          },
        },
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
          select: {
            id: true,
            text: true,
            order: true,
          },
        },
      },
    });

    // Shuffle and take the requested count
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json(selectedQuestions);
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
