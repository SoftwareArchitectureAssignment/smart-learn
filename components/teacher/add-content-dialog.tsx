"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2, Plus, Trash2, Check } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
}

type ContentType = "VIDEO" | "DOCUMENT" | "TEXT" | "QUIZ";

export function AddContentDialog({ open, onOpenChange, sectionId }: AddContentDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentType>("VIDEO");
  const [isLoading, setIsLoading] = useState(false);

  // Video fields
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");

  // Document fields
  const [documentUrl, setDocumentUrl] = useState("");

  // Text fields
  const [textBody, setTextBody] = useState("");

  // Quiz fields
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<
    Array<{
      text: string;
      options: Array<{ text: string; isCorrect: boolean }>;
    }>
  >([
    {
      text: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
    },
  ]);

  const resetForm = () => {
    setTitle("");
    setType("VIDEO");
    setVideoUrl("");
    setVideoDuration("");
    setDocumentUrl("");
    setTextBody("");
    setPassingScore("70");
    setQuestions([
      {
        text: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      let data: any = {};

      switch (type) {
        case "VIDEO":
          if (!videoUrl) {
            alert("Please provide a video URL");
            setIsLoading(false);
            return;
          }
          data = {
            url: videoUrl,
            duration: videoDuration ? parseInt(videoDuration) : null,
          };
          break;

        case "DOCUMENT":
          if (!documentUrl) {
            alert("Please upload a document");
            setIsLoading(false);
            return;
          }
          data = {
            url: documentUrl,
            fileType: null,
            fileSize: null,
          };
          break;

        case "TEXT":
          if (!textBody.trim()) {
            alert("Please provide text content");
            setIsLoading(false);
            return;
          }
          data = {
            body: textBody,
          };
          break;

        case "QUIZ":
          // Validate quiz questions
          if (questions.length < 1) {
            alert("Please add at least 1 question");
            setIsLoading(false);
            return;
          }

          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) {
              alert(`Question ${i + 1} text is required`);
              setIsLoading(false);
              return;
            }
            if (q.options.length < 2) {
              alert(`Question ${i + 1} must have at least 2 options`);
              setIsLoading(false);
              return;
            }
            const hasCorrect = q.options.some((opt) => opt.isCorrect);
            if (!hasCorrect) {
              alert(`Question ${i + 1} must have at least one correct answer`);
              setIsLoading(false);
              return;
            }
            for (let j = 0; j < q.options.length; j++) {
              if (!q.options[j].text.trim()) {
                alert(`Question ${i + 1}, Option ${j + 1} text is required`);
                setIsLoading(false);
                return;
              }
            }
          }

          data = {
            passingScore: parseInt(passingScore) || 70,
            questions: questions.map((q, qIndex) => ({
              text: q.text,
              order: qIndex,
              options: q.options.map((opt, optIndex) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                order: optIndex,
              })),
            })),
          };
          break;
      }

      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          sectionId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      resetForm();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating content:", error);
      alert("Failed to create content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>Add learning material to this section.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Content Title</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction Video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Content Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ContentType)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Fields */}
            {type === "VIDEO" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">Upload Video</Label>
                  <FileUpload
                    value={videoUrl}
                    onChange={setVideoUrl}
                    disabled={isLoading}
                    accept="video/*"
                    maxSize={100}
                  />
                  <p className="text-sm text-gray-500">Upload a video file (MP4, WebM, etc.) up to 100MB</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="videoDuration">Duration (seconds) - Optional</Label>
                  <Input
                    id="videoDuration"
                    type="number"
                    placeholder="e.g., 300"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* Document Fields */}
            {type === "DOCUMENT" && (
              <div className="grid gap-2">
                <Label htmlFor="document">Upload Document</Label>
                <FileUpload
                  value={documentUrl}
                  onChange={setDocumentUrl}
                  disabled={isLoading}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  maxSize={50}
                />
                <p className="text-sm text-gray-500">Upload a document (PDF, DOC, DOCX, PPT, PPTX) up to 50MB</p>
              </div>
            )}

            {/* Text Fields */}
            {type === "TEXT" && (
              <div className="grid gap-2">
                <Label htmlFor="textBody">Text Content</Label>
                <Textarea
                  id="textBody"
                  placeholder="Enter your text content here..."
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  disabled={isLoading}
                  rows={8}
                />
              </div>
            )}

            {/* Quiz Fields */}
            {type === "QUIZ" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g., 70"
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500">
                    Students need to score at least this percentage to pass the quiz.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Questions (minimum 1)</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setQuestions([
                          ...questions,
                          {
                            text: "",
                            options: [
                              { text: "", isCorrect: true },
                              { text: "", isCorrect: false },
                            ],
                          },
                        ]);
                      }}
                      disabled={isLoading}
                    >
                      <Plus className="mr-2 size-4" />
                      Add Question
                    </Button>
                  </div>

                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="space-y-3 rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <Label>Question {qIndex + 1}</Label>
                          <Textarea
                            placeholder="Enter question text..."
                            value={question.text}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].text = e.target.value;
                              setQuestions(newQuestions);
                            }}
                            disabled={isLoading}
                            rows={2}
                          />
                        </div>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setQuestions(questions.filter((_, i) => i !== qIndex));
                            }}
                            disabled={isLoading}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Options (minimum 2)</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].options.push({
                                text: "",
                                isCorrect: false,
                              });
                              setQuestions(newQuestions);
                            }}
                            disabled={isLoading}
                          >
                            <Plus className="mr-1 size-3" />
                            Add Option
                          </Button>
                        </div>

                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant={option.isCorrect ? "default" : "outline"}
                              size="icon"
                              className="size-8 shrink-0"
                              onClick={() => {
                                const newQuestions = [...questions];
                                // Set all options to false first, then set clicked one to true
                                newQuestions[qIndex].options.forEach((opt, i) => {
                                  opt.isCorrect = i === optIndex;
                                });
                                setQuestions(newQuestions);
                              }}
                              disabled={isLoading}
                              title={option.isCorrect ? "Correct answer" : "Mark as correct"}
                            >
                              <Check className="size-4" />
                            </Button>
                            <Input
                              placeholder={`Option ${optIndex + 1}`}
                              value={option.text}
                              onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[qIndex].options[optIndex].text = e.target.value;
                                setQuestions(newQuestions);
                              }}
                              disabled={isLoading}
                              className="flex-1"
                            />
                            {question.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0"
                                onClick={() => {
                                  const newQuestions = [...questions];
                                  newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
                                    (_, i) => i !== optIndex,
                                  );
                                  setQuestions(newQuestions);
                                }}
                                disabled={isLoading}
                              >
                                <Trash2 className="size-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
