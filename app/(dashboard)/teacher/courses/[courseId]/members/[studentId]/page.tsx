import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentQuizDetailsClient } from "@/components/teacher/student-quiz-details-client";

export default async function StudentQuizDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string; studentId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "teacher") {
    redirect("/login");
  }

  const { courseId, studentId } = await params;

  return <StudentQuizDetailsClient courseId={courseId} studentId={studentId} />;
}
