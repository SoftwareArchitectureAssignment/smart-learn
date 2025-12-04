import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseDetailTabs } from "@/components/teacher/course-detail-tabs";

async function getCourseDetails(courseId: string, teacherId: string) {
  // Verify teacher has access to this course
  const courseTeacher = await prisma.courseTeacher.findFirst({
    where: {
      courseId,
      teacherId,
    },
  });

  if (!courseTeacher) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      courseTeachers: {
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
      },
      sections: {
        include: {
          contents: {
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
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
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

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "teacher") {
    redirect("/login");
  }

  const { courseId } = await params;
  const course = await getCourseDetails(courseId, session.user.id);

  if (!course) {
    redirect("/teacher/courses");
  }

  return <CourseDetailTabs course={course} />;
}
