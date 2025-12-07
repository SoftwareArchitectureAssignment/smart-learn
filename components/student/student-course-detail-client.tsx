"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText as FileTextIcon,
  BookOpen,
  CheckCircle,
  User,
  Users,
  Clock,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface StudentCourseDetailClientProps {
  course: any;
}

export function StudentCourseDetailClient({ course }: StudentCourseDetailClientProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Open all sections by default
    const initialState: Record<string, boolean> = {};
    course.sections.forEach((section: any) => {
      initialState[section.id] = true;
    });
    return initialState;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="size-5 text-purple-600" />;
      case "DOCUMENT":
        return <FileTextIcon className="size-5 text-blue-600" />;
      case "TEXT":
        return <BookOpen className="size-5 text-green-600" />;
      case "QUIZ":
        return <CheckCircle className="size-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getContentTypeBadge = (type: string) => {
    const badges = {
      VIDEO: <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Video</Badge>,
      DOCUMENT: <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Document</Badge>,
      TEXT: <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Text</Badge>,
      QUIZ: <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Quiz</Badge>,
    };
    return badges[type as keyof typeof badges] || null;
  };

  const [openContents, setOpenContents] = useState<Record<string, boolean>>({});

  const toggleContent = (contentId: string) => {
    setOpenContents((prev) => ({
      ...prev,
      [contentId]: !prev[contentId],
    }));
  };

  const renderContent = (content: any) => {
    switch (content.type) {
      case "VIDEO":
        return (
          <Collapsible open={openContents[content.id]} onOpenChange={() => toggleContent(content.id)}>
            <div className="rounded-lg border">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getContentIcon(content.type)}
                  <div className="text-left">
                    <h3 className="font-semibold">{content.title}</h3>
                    {content.video?.duration && (
                      <p className="text-sm text-gray-600">
                        Duration: {Math.floor(content.video.duration / 60)} minutes
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getContentTypeBadge(content.type)}
                  {openContents[content.id] ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t p-4">
                  {content.video?.url && (
                    <div className="aspect-video overflow-hidden rounded-lg bg-black">
                      <video src={content.video.url} controls className="size-full">
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );

      case "DOCUMENT":
        return (
          <Collapsible open={openContents[content.id]} onOpenChange={() => toggleContent(content.id)}>
            <div className="rounded-lg border">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getContentIcon(content.type)}
                  <div className="text-left">
                    <h3 className="font-semibold">{content.title}</h3>
                    {content.document?.fileType && <p className="text-sm text-gray-600">{content.document.fileType}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getContentTypeBadge(content.type)}
                  {openContents[content.id] ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t p-4">
                  <a href={content.document?.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Open Document</Button>
                  </a>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );

      case "TEXT":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getContentIcon(content.type)}
                <h3 className="font-semibold">{content.title}</h3>
              </div>
              {getContentTypeBadge(content.type)}
            </div>
            <div className="prose max-w-none rounded-lg bg-gray-50 p-4">
              <div
                className="text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: content.text?.body || "",
                }}
              />
            </div>
          </div>
        );

      case "QUIZ":
        const numQuestions = content.quiz?.questions.length || 0;
        const numAttempts = content.quiz?.attempts?.length || 0;
        const passingScore = content.quiz?.passingScore || 0;

        return (
          <div className="rounded-lg border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {getContentIcon(content.type)}
                <div>
                  <h3 className="font-semibold">{content.title}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="size-4" />
                      <span>{numQuestions} questions</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <History className="size-4" />
                      <span>{numAttempts} attempts</span>
                    </div>
                    <span>•</span>
                    <span>Passing: {passingScore}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getContentTypeBadge(content.type)}
                {numAttempts > 0 && (
                  <Link href={`/student/quiz/${content.quiz.id}/attempts`}>
                    <Button variant="outline" size="sm">
                      <History className="mr-2 size-4" />
                      View Attempts
                    </Button>
                  </Link>
                )}
                <Link href={`/student/quiz/${content.quiz.id}/attempt`}>
                  <Button>Attempt Quiz</Button>
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/student/courses">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 size-4" />
              Back to My Courses
            </Button>
          </Link>

          <Card>
            <CardHeader>
              {course.thumbnail && (
                <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img src={course.thumbnail} alt={course.title} className="size-full object-cover" />
                </div>
              )}
              <CardTitle className="text-3xl">{course.title}</CardTitle>
              {course.description && <CardDescription className="mt-2 text-base">{course.description}</CardDescription>}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{course.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4" />
                  <span>{course._count.enrollments} students</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Course Content */}
        <div className="space-y-4">
          {course.sections.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="mb-4 size-16 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">No content available yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  The instructor hasn't added any content to this course yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            course.sections.map((section: any) => (
              <Card key={section.id}>
                <Collapsible open={openSections[section.id]} onOpenChange={() => toggleSection(section.id)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between hover:bg-gray-50">
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      {openSections[section.id] ? (
                        <ChevronDown className="size-5" />
                      ) : (
                        <ChevronRight className="size-5" />
                      )}
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-4">
                      {section.contents.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-500">No content in this section</p>
                      ) : (
                        section.contents.map((content: any) => (
                          <div key={content.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                            {renderContent(content)}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
