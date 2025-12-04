import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContentType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, sectionId, data } = body;

    if (!title || !type || !sectionId) {
      return NextResponse.json(
        { error: "Title, type, and sectionId are required" },
        { status: 400 }
      );
    }

    // Verify section belongs to teacher's course
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
      },
      include: {
        course: true,
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    // Verify teacher has access to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        courseId: section.courseId,
        teacherId: session.user.id,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the highest order number
    const lastContent = await prisma.content.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
    });

    const order = lastContent ? lastContent.order + 1 : 0;

    // Create content with related data based on type
    const content = await prisma.content.create({
      data: {
        title,
        type: type as ContentType,
        sectionId,
        order,
        ...(type === "VIDEO" && data?.url && {
          video: {
            create: {
              url: data.url,
              duration: data.duration || null,
            },
          },
        }),
        ...(type === "DOCUMENT" && data?.url && {
          document: {
            create: {
              url: data.url,
              fileType: data.fileType || null,
              fileSize: data.fileSize || null,
            },
          },
        }),
        ...(type === "TEXT" && data?.body && {
          text: {
            create: {
              body: data.body,
            },
          },
        }),
        ...(type === "QUIZ" && {
          quiz: {
            create: {
              passingScore: data?.passingScore || 70,
              questions: {
                create: data?.questions?.map((q: any) => ({
                  text: q.text,
                  order: q.order,
                  options: {
                    create: q.options.map((opt: any) => ({
                      text: opt.text,
                      isCorrect: opt.isCorrect,
                      order: opt.order,
                    })),
                  },
                })) || [],
              },
            },
          },
        }),
      },
      include: {
        video: true,
        document: true,
        text: true,
        quiz: true,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Verify content belongs to teacher's course
    const content = await prisma.content.findFirst({
      where: {
        id,
      },
      include: {
        video: true,
        document: true,
        text: true,
        quiz: true,
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (content) {
      // Verify teacher has access to this course
      const courseTeacher = await prisma.courseTeacher.findFirst({
        where: {
          courseId: content.section.course.id,
          teacherId: session.user.id,
        },
      });

      if (!courseTeacher) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content not found or unauthorized" },
        { status: 404 }
      );
    }

    // Handle quiz questions update separately
    if (content.type === "QUIZ" && content.quiz && data?.questions) {
      // Delete all existing questions and options
      await prisma.question.deleteMany({
        where: { quizId: content.quiz.id },
      });

      // Create new questions and options
      await prisma.question.createMany({
        data: data.questions.map((q: any) => ({
          quizId: content.quiz!.id,
          text: q.text,
          order: q.order,
        })),
      });

      // Get the newly created questions
      const newQuestions = await prisma.question.findMany({
        where: { quizId: content.quiz.id },
        orderBy: { order: "asc" },
      });

      // Create options for each question
      for (let i = 0; i < data.questions.length; i++) {
        const questionData = data.questions[i];
        const question = newQuestions[i];
        
        await prisma.option.createMany({
          data: questionData.options.map((opt: any) => ({
            questionId: question.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: opt.order,
          })),
        });
      }
    }

    // Update content and related data
    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content.type === "VIDEO" && content.video && data && {
          video: {
            update: {
              ...(data.url && { url: data.url }),
              ...(data.duration !== undefined && { duration: data.duration }),
            },
          },
        }),
        ...(content.type === "DOCUMENT" && content.document && data && {
          document: {
            update: {
              ...(data.url && { url: data.url }),
            },
          },
        }),
        ...(content.type === "TEXT" && content.text && data?.body && {
          text: {
            update: {
              body: data.body,
            },
          },
        }),
        ...(content.type === "QUIZ" && content.quiz && data && {
          quiz: {
            update: {
              passingScore: data.passingScore,
            },
          },
        }),
      },
      include: {
        video: true,
        document: true,
        text: true,
        quiz: {
          include: {
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

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Verify content belongs to teacher's course
    const content = await prisma.content.findFirst({
      where: {
        id,
      },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Verify teacher has access to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        courseId: content.section.course.id,
        teacherId: session.user.id,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
