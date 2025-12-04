import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentCourseDetailClient } from "@/components/student/student-course-detail-client";

async function getCourseDetails(courseId: string, studentId: string) {
  // Check if student is enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    return null;
  }

  // Get course with all sections and contents
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          contents: {
            orderBy: { order: "asc" },
            include: {
              video: true,
              document: true,
              text: true,
              quiz: {
                include: {
                  questions: {
                    orderBy: { order: "asc" },
                    include: {
                      options: {
                        orderBy: { order: "asc" },
                      },
                    },
                  },
                  attempts: {
                    where: {
                      studentId,
                    },
                    orderBy: {
                      attemptedAt: "desc",
                    },
                  },
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  return course;
}

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "student") {
    redirect("/login");
  }

  const { courseId } = await params;
  const course = await getCourseDetails(courseId, session.user.id);

  if (!course) {
    redirect("/student/courses");
  }

  return <StudentCourseDetailClient course={course} />;
}
