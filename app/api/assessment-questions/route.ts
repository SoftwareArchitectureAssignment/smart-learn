import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await prisma.assessmentQuestion.findMany({
      include: {
        topics: {
          include: {
            topic: true,
          },
        },
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    return NextResponse.json({ error: "Failed to fetch assessment questions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, topicIds, options } = body;

    if (!text || !topicIds || topicIds.length === 0 || !options || options.length < 2) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const question = await prisma.assessmentQuestion.create({
      data: {
        text,
        topics: {
          create: topicIds.map((topicId: string) => ({
            topic: {
              connect: { id: topicId },
            },
          })),
        },
        options: {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        },
      },
      include: {
        topics: {
          include: {
            topic: true,
          },
        },
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error creating assessment question:", error);
    return NextResponse.json({ error: "Failed to create assessment question" }, { status: 500 });
  }
}
