import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentDashboardClient } from "@/components/student/student-dashboard-client";

async function getCoursesData(studentId: string) {
  // Get all available courses
  const allCourses = await prisma.course.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get enrolled course IDs
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
    },
    select: {
      courseId: true,
    },
  });

  return {
    allCourses,
    enrolledCourseIds: enrollments.map((e) => e.courseId),
  };
}

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "student") {
    redirect("/login");
  }

  const coursesData = await getCoursesData(session.user.id);

  return <StudentDashboardClient coursesData={coursesData} />;
}
