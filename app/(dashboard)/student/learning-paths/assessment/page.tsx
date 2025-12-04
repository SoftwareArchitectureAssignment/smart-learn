import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssessmentTestClient } from "@/components/student/assessment-test-client";

export default async function AssessmentTestPage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string; count?: string }>;
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== "student") {
    redirect("/login");
  }

  // Fetch all topics
  const topics = await prisma.topic.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const params = await searchParams;

  return (
    <AssessmentTestClient
      topics={topics}
      initialTopicId={params.topicId}
      initialCount={params.count ? parseInt(params.count) : undefined}
    />
  );
}
