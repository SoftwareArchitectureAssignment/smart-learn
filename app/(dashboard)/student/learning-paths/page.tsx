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

  // Fetch all assessment attempts
  const assessmentAttempts = await prisma.assessmentAttempt.findMany({
    where: {
      studentId: user.id,
    },
    include: {
      learningPath: {
        include: {
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
      },
    },
    orderBy: {
      attemptedAt: "desc",
    },
  });

  // Fetch topics for the assessment attempts
  const topicIds = [...new Set(assessmentAttempts.map((a) => a.topicId))];
  const topicsMap = await prisma.topic.findMany({
    where: {
      id: { in: topicIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Map topics to assessment attempts
  const topicsById = new Map(topicsMap.map((t) => [t.id, t]));
  const attemptsWithTopics = assessmentAttempts.map((attempt) => ({
    ...attempt,
    topic: topicsById.get(attempt.topicId) || { id: attempt.topicId, name: "Unknown Topic" },
  }));

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
        assessmentAttempts={JSON.parse(JSON.stringify(attemptsWithTopics))}
        enrolledCourseIds={Array.from(enrolledCourseIds)}
      />
    </div>
  );
}
