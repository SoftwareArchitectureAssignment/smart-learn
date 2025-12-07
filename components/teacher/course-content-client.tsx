"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  MoreVertical,
  Users,
  FileText,
  Pencil,
  Trash2,
  BookOpen,
  PlayCircle,
  FileIcon,
  AlignLeft,
  ClipboardList,
  GripVertical,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddSectionDialog } from "@/components/teacher/add-section-dialog";
import { AddContentDialog } from "@/components/teacher/add-content-dialog";
import { ViewContentDialog } from "@/components/teacher/view-content-dialog";
import { EditContentDialog } from "@/components/teacher/edit-content-dialog";
import { useRouter } from "next/navigation";

interface CourseContentClientProps {
  course: any;
  hideHeader?: boolean;
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return <PlayCircle className="size-4 text-blue-600" />;
    case "DOCUMENT":
      return <FileIcon className="size-4 text-green-600" />;
    case "TEXT":
      return <AlignLeft className="size-4 text-purple-600" />;
    case "QUIZ":
      return <ClipboardList className="size-4 text-orange-600" />;
    default:
      return <FileText className="size-4 text-gray-600" />;
  }
};

const getContentTypeBadge = (type: string) => {
  const colors = {
    VIDEO: "bg-blue-100 text-blue-800",
    DOCUMENT: "bg-green-100 text-green-800",
    TEXT: "bg-purple-100 text-purple-800",
    QUIZ: "bg-orange-100 text-orange-800",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export function CourseContentClient({ course, hideHeader = false }: CourseContentClientProps) {
  const router = useRouter();
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addContentOpen, setAddContentOpen] = useState(false);
  const [viewContentOpen, setViewContentOpen] = useState(false);
  const [editContentOpen, setEditContentOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const totalContents = course.sections.reduce((acc: number, section: any) => acc + section.contents.length, 0);

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section? All contents will be removed.")) {
      return;
    }

    try {
      const response = await fetch(`/api/sections?id=${sectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete section");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Failed to delete section. Please try again.");
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contents?id=${contentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content. Please try again.");
    }
  };

  const handleAddContent = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setAddContentOpen(true);
  };

  const handleViewContent = (content: any) => {
    setSelectedContent(content);
    setViewContentOpen(true);
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setEditContentOpen(true);
  };

  return (
    <div className={hideHeader ? "" : "p-8"}>
      {/* Header */}
      {!hideHeader && (
        <div className="mb-8">
          <Link href="/teacher/courses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 size-4" />
              Back to Courses
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="mt-2 text-gray-600">{course.description || "No description provided"}</p>
              <div className="mt-4 flex items-center gap-4">
                <Badge variant={course._count.enrollments > 0 ? "default" : "secondary"}>
                  {course._count.enrollments > 0 ? "Active" : "Draft"}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="size-4" />
                  <span>{course._count.enrollments} students enrolled</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/teacher/courses/${course.id}/edit`}>
                <Button variant="outline">
                  <Pencil className="mr-2 size-4" />
                  Edit Course
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
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      {/* Course Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <BookOpen className="size-4" />
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.sections.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <FileText className="size-4" />
              Total Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Users className="size-4" />
              Enrolled Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course._count.enrollments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Thumbnail */}
      {course.thumbnail && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              <img src={course.thumbnail} alt={course.title} className="size-full object-cover" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Content</CardTitle>
              <CardDescription className="mt-1">Manage sections and learning materials</CardDescription>
            </div>
            <Button onClick={() => setAddSectionOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {course.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16">
              <div className="rounded-full bg-blue-100 p-4">
                <BookOpen className="size-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No sections yet</h3>
              <p className="mt-2 text-center text-sm text-gray-600">Start building your course by adding sections</p>
              <Button className="mt-6" onClick={() => setAddSectionOpen(true)}>
                <Plus className="mr-2 size-4" />
                Add Your First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {course.sections.map((section: any, sectionIndex: number) => (
                <div key={section.id} className="rounded-lg border bg-white transition-shadow hover:shadow-md">
                  {/* Section Header */}
                  <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="size-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Section {sectionIndex + 1}: {section.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.contents.length} content
                          {section.contents.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAddContent(section.id)}>
                        <Plus className="mr-2 size-4" />
                        Add Content
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Pencil className="mr-2 size-4" />
                            Edit Section
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete Section
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Section Contents */}
                  <div className="p-4">
                    {section.contents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8">
                        <FileText className="size-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">No content in this section</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => handleAddContent(section.id)}
                        >
                          <Plus className="mr-2 size-3" />
                          Add Content
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {section.contents.map((content: any, contentIndex: number) => (
                          <div key={content.id} className="rounded-lg border bg-white">
                            {/* Content Header */}
                            <div className="flex items-center justify-between border-b p-3 transition-colors hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <GripVertical className="size-4 text-gray-400" />
                                <div className="flex items-center gap-2">
                                  {getContentIcon(content.type)}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">
                                        {contentIndex + 1}. {content.title}
                                      </span>
                                      <Badge className={getContentTypeBadge(content.type)} variant="secondary">
                                        {content.type}
                                      </Badge>
                                    </div>
                                    {content.type === "VIDEO" && content.video && (
                                      <p className="text-xs text-gray-600">
                                        Duration:{" "}
                                        {content.video.duration
                                          ? `${Math.floor(content.video.duration / 60)}:${String(
                                              content.video.duration % 60,
                                            ).padStart(2, "0")}`
                                          : "N/A"}
                                      </p>
                                    )}
                                    {content.type === "DOCUMENT" && content.document && (
                                      <p className="text-xs text-gray-600">
                                        {content.document.fileType} •{" "}
                                        {content.document.fileSize
                                          ? `${(content.document.fileSize / 1024 / 1024).toFixed(2)} MB`
                                          : "N/A"}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditContent(content)}>
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteContent(content.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Content Preview */}
                            <div className="p-4">
                              {/* Video Preview */}
                              {content.type === "VIDEO" && content.video && (
                                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                                  <video src={content.video.url} controls className="size-full">
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}

                              {/* Document Preview */}
                              {content.type === "DOCUMENT" && content.document && (
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-8">
                                  <FileIcon className="mb-2 size-12 text-blue-600" />
                                  <p className="mb-2 text-sm font-medium text-gray-700">Document File</p>
                                  <a
                                    href={content.document.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button variant="outline" size="sm">
                                      View Document
                                    </Button>
                                  </a>
                                </div>
                              )}

                              {/* Text Preview */}
                              {content.type === "TEXT" && content.text && (
                                <div className="rounded-lg border bg-gray-50 p-4">
                                  <div className="line-clamp-6 text-sm whitespace-pre-wrap text-gray-700">
                                    {content.text.body}
                                  </div>
                                  {content.text.body.length > 300 && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="mt-2 h-auto p-0"
                                      onClick={() => handleViewContent(content)}
                                    >
                                      Read more...
                                    </Button>
                                  )}
                                </div>
                              )}

                              {/* Quiz Preview */}
                              {content.type === "QUIZ" && content.quiz && (
                                <div className="space-y-3">
                                  <div className="rounded-lg border bg-blue-50 p-3">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Passing Score:</span> {content.quiz.passingScore}%
                                    </p>
                                    <p className="mt-1 text-sm text-gray-700">
                                      <span className="font-medium">Questions:</span>{" "}
                                      {content.quiz.questions?.length || 0}
                                    </p>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => handleViewContent(content)}>
                                    View All Questions
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddSectionDialog open={addSectionOpen} onOpenChange={setAddSectionOpen} courseId={course.id} />
      <AddContentDialog open={addContentOpen} onOpenChange={setAddContentOpen} sectionId={selectedSectionId} />
      <ViewContentDialog open={viewContentOpen} onOpenChange={setViewContentOpen} content={selectedContent} />
      <EditContentDialog open={editContentOpen} onOpenChange={setEditContentOpen} content={selectedContent} />
    </div>
  );
}
