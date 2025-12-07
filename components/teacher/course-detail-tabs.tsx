"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseContentClient } from "./course-content-client";
import { CourseMembersClient } from "./course-members-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ArrowLeft, Pencil, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseDetailTabsProps {
  course: any;
}

export function CourseDetailTabs({ course }: CourseDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/teacher/courses">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 size-4" />
            Quay lại danh sách khóa học
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-gray-600">{course.description || "Chưa có mô tả"}</p>
            <div className="mt-4 flex items-center gap-4">
              <Badge variant={course._count.enrollments > 0 ? "default" : "secondary"}>
                {course._count.enrollments > 0 ? "Đang hoạt động" : "Nháp"}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="size-4" />
                <span>{course._count.enrollments} học viên</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/teacher/courses/${course.id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 size-4" />
                Chỉnh sửa
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <Trash2 className="mr-2 size-4" />
                  Xóa khóa học
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="content" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Nội dung
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Thành viên ({course._count.enrollments})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <CourseContentClient course={course} hideHeader={true} />
        </TabsContent>

        <TabsContent value="members">
          <CourseMembersClient courseId={course.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
