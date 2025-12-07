"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, FileText, CheckCircle, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentCoursesClientProps {
  coursesData: {
    allCourses: any[];
    enrolledCourses: any[];
    enrolledCourseIds: string[];
  };
}

export function StudentCoursesClient({ coursesData }: StudentCoursesClientProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

  const { allCourses, enrolledCourses, enrolledCourseIds } = coursesData;

  // Filter available courses (not enrolled yet)
  const availableCourses = allCourses.filter((course) => !enrolledCourseIds.includes(course.id));

  const handleEnroll = async (courseId: string) => {
    setIsEnrolling(courseId);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll");
      }

      router.refresh();
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll in course. Please try again.");
    } finally {
      setIsEnrolling(null);
    }
  };

  const CourseCard = ({ course, enrolled = false }: { course: any; enrolled?: boolean }) => (
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
        {enrolled ? (
          <Link href={`/student/courses/${course.id}`} className="w-full">
            <Button className="w-full">
              <BookOpen className="mr-2 size-4" />
              Continue Learning
            </Button>
          </Link>
        ) : (
          <Button className="w-full" onClick={() => handleEnroll(course.id)} disabled={isEnrolling === course.id}>
            {isEnrolling === course.id ? (
              <>
                <Clock className="mr-2 size-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 size-4" />
                Enroll Now
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <p className="mt-2 text-gray-600">Browse and enroll in courses</p>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="enrolled">My Courses ({enrolledCourses.length})</TabsTrigger>
          <TabsTrigger value="all">All Courses ({allCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="mt-6">
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.id} course={course} enrolled={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {availableCourses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="size-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">You're enrolled in all courses!</h3>
                <p className="mt-2 text-center text-sm text-gray-600">Great job! Check back later for new courses.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <CourseCard key={course.id} course={course} enrolled={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
