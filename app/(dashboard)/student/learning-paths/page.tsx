import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LearningPathsClient } from "@/components/student/learning-paths-client";

export default async function StudentLearningPathsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch all topics
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Fetch user's learning paths
  const learningPaths = await prisma.learningPath.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      assessmentAttempt: {
        select: {
          topicId: true,
          score: true,
          totalScore: true,
          totalQuestions: true,
          answers: true,
        },
      },
      courses: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnail: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get user's enrollments for all courses
  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: user.id,
    },
    select: {
      courseId: true,
    },
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <div className="p-8">
      <LearningPathsClient
        topics={topics}
        initialLearningPaths={JSON.parse(JSON.stringify(learningPaths))}
        enrolledCourseIds={Array.from(enrolledCourseIds)}
      />
    </div>
  );
}
