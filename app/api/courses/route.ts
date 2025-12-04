import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, thumbnail } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        thumbnail: thumbnail || null,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    let courses;

    if (session.user.role === "teacher") {
      // Get all courses for teachers
      courses = await prisma.course.findMany({
        include: {
          _count: {
            select: {
              enrollments: true,
              sections: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } else {
      // For students, get enrolled courses
      const enrollments = await prisma.enrollment.findMany({
        where: {
          studentId: session.user.id,
        },
        include: {
          course: {
            include: {
              _count: {
                select: {
                  sections: true,
                },
              },
            },
          },
        },
      });

      courses = enrollments.map((e) => e.course);
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
