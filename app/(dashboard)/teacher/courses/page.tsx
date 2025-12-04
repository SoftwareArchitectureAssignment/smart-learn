import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus, MoreVertical, Users, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function getCourses(teacherId: string) {
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          sections: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return courses;
}

export default async function TeacherCoursesPage() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "teacher") {
    redirect("/login");
  }

  const courses = await getCourses(session.user.id);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-2 text-gray-600">Create and manage your courses</p>
        </div>
        <Link href="/teacher/courses/create">
          <Button>
            <Plus className="mr-2 size-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-blue-100 p-4">
              <BookOpen className="size-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No courses yet</h3>
            <p className="mt-2 text-center text-sm text-gray-600">Get started by creating your first course</p>
            <Link href="/teacher/courses/create">
              <Button className="mt-6">
                <Plus className="mr-2 size-4" />
                Create Your First Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="group transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {course.description || "No description"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/teacher/courses/${course.id}/edit`} className="cursor-pointer">
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {course.thumbnail && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
                    <img src={course.thumbnail} alt={course.title} className="size-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="size-4" />
                      <span>{course._count.enrollments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="size-4" />
                      <span>{course._count.sections} sections</span>
                    </div>
                  </div>
                  <Badge variant={course._count.enrollments > 0 ? "default" : "secondary"}>
                    {course._count.enrollments > 0 ? "Active" : "Draft"}
                  </Badge>
                </div>
                <Link href={`/teacher/courses/${course.id}`}>
                  <Button className="mt-4 w-full" variant="outline">
                    Manage Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
