"use client";

import Link from "next/link";
import { BookOpen, Users, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentMyCoursesClientProps {
  enrolledCourses: any[];
}

export function StudentMyCoursesClient({ enrolledCourses }: StudentMyCoursesClientProps) {
  const CourseCard = ({ course }: { course: any }) => (
    <Card className="group transition-shadow hover:shadow-lg">
      <CardHeader>
        {course.thumbnail && (
          <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description || "No description"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="size-4" />
            <span>{course.teacher?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{course._count.enrollments} students</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="size-4" />
              <span>{course._count.sections} sections</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/student/courses/${course.id}`} className="w-full">
          <Button className="w-full">
            <BookOpen className="mr-2 size-4" />
            Continue Learning
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-2 text-gray-600">Your enrolled courses</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-blue-100 p-4">
              <BookOpen className="size-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No enrolled courses yet</h3>
            <p className="mt-2 text-center text-sm text-gray-600">
              Explore available courses and start learning today!
            </p>
            <Link href="/student/dashboard" className="mt-4">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
