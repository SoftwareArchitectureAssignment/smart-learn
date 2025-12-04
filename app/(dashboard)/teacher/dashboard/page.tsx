import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back, {session.user.name}!</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Total Students</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Active Quizzes</h2>
          <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
}
