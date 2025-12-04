import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId } = await params;
    const body = await request.json();
    const { text, topicIds, options } = body;

    if (!text || !topicIds || topicIds.length === 0 || !options || options.length < 2) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Delete existing options and topics
    await prisma.assessmentOption.deleteMany({
      where: { questionId },
    });

    await prisma.assessmentQuestionTopic.deleteMany({
      where: { questionId },
    });

    // Update question and create new topics and options
    const question = await prisma.assessmentQuestion.update({
      where: { id: questionId },
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
    console.error("Error updating assessment question:", error);
    return NextResponse.json({ error: "Failed to update assessment question" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId } = await params;
    await prisma.assessmentQuestion.delete({
      where: { id: questionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assessment question:", error);
    return NextResponse.json({ error: "Failed to delete assessment question" }, { status: 500 });
  }
}
