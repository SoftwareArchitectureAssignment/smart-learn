import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: Promise<{ pathId: string }> }) {
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

    const { pathId } = await params;

    // Check if learning path exists and belongs to the user
    const learningPath = await prisma.learningPath.findUnique({
      where: {
        id: pathId,
        studentId: user.id,
      },
    });

    if (!learningPath) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 });
    }

    // Update the learning path to enrolled
    const updatedPath = await prisma.learningPath.update({
      where: {
        id: pathId,
      },
      data: {
        isEnrolled: true,
        enrolledAt: new Date(),
        status: "IN_PROGRESS",
      },
    });

    // Enroll user in all courses in the learning path
    const courses = await prisma.learningPathCourse.findMany({
      where: {
        learningPathId: pathId,
      },
      select: {
        courseId: true,
      },
    });

    // Create enrollments for courses that the user hasn't enrolled in yet
    for (const course of courses) {
      await prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: course.courseId,
          },
        },
        create: {
          studentId: user.id,
          courseId: course.courseId,
        },
        update: {},
      });
    }

    return NextResponse.json(updatedPath);
  } catch (error) {
    console.error("Error enrolling in learning path:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
