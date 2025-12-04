import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentMyCoursesClient } from "@/components/student/student-my-courses-client";

async function getEnrolledCourses(studentId: string) {
  const enrolledCourses = await prisma.enrollment.findMany({
    where: {
      studentId,
    },
    include: {
      course: {
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              sections: true,
            },
          },
        },
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });

  return enrolledCourses.map((e) => e.course);
}

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "student") {
    redirect("/login");
  }

  const enrolledCourses = await getEnrolledCourses(session.user.id);

  return <StudentMyCoursesClient enrolledCourses={enrolledCourses} />;
}
