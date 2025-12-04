import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get all teachers assigned to a course
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;

    // Verify teacher has access to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        courseId,
        teacherId: session.user.id,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get all teachers for this course
    const teachers = await prisma.courseTeacher.findMany({
      where: {
        courseId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        addedAt: "asc",
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching course teachers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add a teacher to a course
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const body = await req.json();
    const { teacherEmail } = body;

    if (!teacherEmail) {
      return NextResponse.json(
        { error: "Teacher email is required" },
        { status: 400 }
      );
    }

    // Verify current teacher has access to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        courseId,
        teacherId: session.user.id,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the teacher to add
    const teacherToAdd = await prisma.user.findFirst({
      where: {
        email: teacherEmail,
        role: "teacher",
      },
    });

    if (!teacherToAdd) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Check if teacher is already assigned
    const existing = await prisma.courseTeacher.findFirst({
      where: {
        courseId,
        teacherId: teacherToAdd.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Teacher already assigned to this course" },
        { status: 400 }
      );
    }

    // Add teacher to course
    const newCourseTeacher = await prisma.courseTeacher.create({
      data: {
        courseId,
        teacherId: teacherToAdd.id,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(newCourseTeacher);
  } catch (error) {
    console.error("Error adding teacher to course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove a teacher from a course
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // Verify current teacher has access to this course
    const courseTeacher = await prisma.courseTeacher.findFirst({
      where: {
        courseId,
        teacherId: session.user.id,
      },
    });

    if (!courseTeacher) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if this is the last teacher
    const teacherCount = await prisma.courseTeacher.count({
      where: {
        courseId,
      },
    });

    if (teacherCount <= 1) {
      return NextResponse.json(
        { error: "Cannot remove the last teacher from the course" },
        { status: 400 }
      );
    }

    // Remove teacher from course
    await prisma.courseTeacher.deleteMany({
      where: {
        courseId,
        teacherId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing teacher from course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
