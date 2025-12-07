"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, PlayCircle, FileText as FileTextIcon, AlignLeft, ClipboardList } from "lucide-react";

interface ViewContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
}

const getContentIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return <PlayCircle className="size-5 text-blue-600" />;
    case "DOCUMENT":
      return <FileTextIcon className="size-5 text-green-600" />;
    case "TEXT":
      return <AlignLeft className="size-5 text-purple-600" />;
    case "QUIZ":
      return <ClipboardList className="size-5 text-orange-600" />;
    default:
      return <FileTextIcon className="size-5 text-gray-600" />;
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

export function ViewContentDialog({ open, onOpenChange, content }: ViewContentDialogProps) {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getContentIcon(content.type)}
            <div className="flex-1">
              <DialogTitle>{content.title}</DialogTitle>
              <Badge className={`mt-2 ${getContentTypeBadge(content.type)}`} variant="secondary">
                {content.type}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Video Content */}
          {content.type === "VIDEO" && content.video && (
            <div className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                <video src={content.video.url} controls className="size-full">
                  Your browser does not support the video tag.
                </video>
              </div>
              {content.video.duration && (
                <p className="text-sm text-gray-600">
                  Duration: {Math.floor(content.video.duration / 60)}:
                  {String(content.video.duration % 60).padStart(2, "0")}
                </p>
              )}
            </div>
          )}

          {/* Document Content */}
          {content.type === "DOCUMENT" && content.document && (
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-8">
                <FileTextIcon className="mb-3 size-16 text-blue-600" />
                <p className="mb-2 text-sm font-medium text-gray-700">Document File</p>
                <a
                  href={content.document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Button variant="outline">View Document</Button>
                </a>
              </div>
              {content.document.fileType && (
                <p className="text-sm text-gray-600">
                  Type: {content.document.fileType}
                  {content.document.fileSize && ` • Size: ${(content.document.fileSize / 1024 / 1024).toFixed(2)} MB`}
                </p>
              )}
            </div>
          )}

          {/* Text Content */}
          {content.type === "TEXT" && content.text && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="text-sm whitespace-pre-wrap text-gray-700">{content.text.body}</div>
              </div>
            </div>
          )}

          {/* Quiz Content */}
          {content.type === "QUIZ" && content.quiz && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-blue-50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Passing Score:</span> {content.quiz.passingScore}%
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-medium">Questions:</span> {content.quiz.questions?.length || 0}
                </p>
              </div>

              {content.quiz.questions && content.quiz.questions.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Questions:</h4>
                  {content.quiz.questions.map((question: any, qIndex: number) => (
                    <div key={question.id} className="space-y-3 rounded-lg border p-4">
                      <div className="font-medium text-gray-900">
                        {qIndex + 1}. {question.text}
                      </div>
                      <div className="ml-4 space-y-2">
                        {question.options?.map((option: any, optIndex: number) => (
                          <div
                            key={option.id}
                            className={`flex items-center gap-2 rounded p-2 ${
                              option.isCorrect ? "border border-green-200 bg-green-50" : "bg-gray-50"
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-600">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="text-sm text-gray-700">{option.text}</span>
                            {option.isCorrect && <Badge className="ml-auto bg-green-600">Correct</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
