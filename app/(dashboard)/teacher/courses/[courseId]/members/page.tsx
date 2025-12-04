import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseMembersClient } from "@/components/teacher/course-members-client";

export default async function CourseMembersPage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "teacher") {
    redirect("/login");
  }

  const { courseId } = await params;

  return <CourseMembersClient courseId={courseId} />;
}
