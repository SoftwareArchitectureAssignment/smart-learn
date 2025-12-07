"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Eye,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface AttemptDetail {
  id: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
}

interface QuizWithAttempts {
  quizId: string;
  quizTitle: string;
  sectionTitle: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  attempts: AttemptDetail[];
}

interface StudentQuizData {
  student: Student;
  enrolledAt: string;
  quizzes: QuizWithAttempts[];
}

interface QuestionDetail {
  id: string;
  text: string;
  order: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface AttemptDetailData {
  id: string;
  student: Student;
  courseId: string;
  courseTitle: string;
  sectionTitle: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
  questions: QuestionDetail[];
}

export function StudentQuizDetailsClient({ courseId, studentId }: { courseId: string; studentId: string }) {
  const router = useRouter();
  const [data, setData] = useState<StudentQuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<string>>(new Set());
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptDetailData | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId, studentId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/members/${studentId}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetail = async (attemptId: string) => {
    try {
      const response = await fetch(`/api/quiz-attempts/${attemptId}`);
      if (response.ok) {
        const result = await response.json();
        setSelectedAttempt(result);
        setFeedback(result.feedback || "");
      }
    } catch (error) {
      console.error("Error fetching attempt detail:", error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAttempt || !feedback.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quiz-attempts/${selectedAttempt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedAttempt({ ...selectedAttempt, feedback: result.feedback });
        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAIFeedback = async () => {
    if (!selectedAttempt) return;

    setGenerating(true);
    try {
      const response = await fetch(`/api/quiz-attempts/${selectedAttempt.id}/generate-feedback`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        setFeedback(result.feedback);
        setSelectedAttempt({ ...selectedAttempt, feedback: result.feedback });
        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error("Error generating AI feedback:", error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleQuiz = (quizId: string) => {
    const newExpanded = new Set(expandedQuizzes);
    if (newExpanded.has(quizId)) {
      newExpanded.delete(quizId);
    } else {
      newExpanded.add(quizId);
    }
    setExpandedQuizzes(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    if (score >= 50) return "outline";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Không tìm thấy dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {data.student.image ? (
                <img src={data.student.image} alt={data.student.name || ""} />
              ) : (
                <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-2xl">
                  {data.student.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </Avatar>
            <div>
              <CardTitle>{data.student.name}</CardTitle>
              <CardDescription>{data.student.email}</CardDescription>
              <p className="text-muted-foreground mt-1 text-sm">
                Tham gia: {new Date(data.enrolledAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {data.quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Học viên chưa làm bài kiểm tra nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.quizzes.map((quiz) => (
            <Card key={quiz.quizId}>
              <Collapsible open={expandedQuizzes.has(quiz.quizId)} onOpenChange={() => toggleQuiz(quiz.quizId)}>
                <CardHeader className="cursor-pointer">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 text-left">
                        {expandedQuizzes.has(quiz.quizId) ? (
                          <ChevronDown className="mt-1 h-5 w-5 shrink-0" />
                        ) : (
                          <ChevronRight className="mt-1 h-5 w-5 shrink-0" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{quiz.quizTitle}</CardTitle>
                          <CardDescription>{quiz.sectionTitle}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground">Lượt làm</div>
                          <div className="font-semibold">{quiz.totalAttempts}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Điểm TB</div>
                          <div className={`font-semibold ${getScoreColor(quiz.averageScore)}`}>
                            {quiz.averageScore.toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Cao nhất</div>
                          <div className={`font-semibold ${getScoreColor(quiz.bestScore)}`}>
                            {quiz.bestScore.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lần</TableHead>
                          <TableHead>Điểm</TableHead>
                          <TableHead>Phần trăm</TableHead>
                          <TableHead>Thời gian</TableHead>
                          <TableHead>Nhận xét</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quiz.attempts.map((attempt, index) => (
                          <TableRow key={attempt.id}>
                            <TableCell>#{quiz.attempts.length - index}</TableCell>
                            <TableCell>
                              {attempt.score}/{attempt.totalScore}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getScoreBadgeVariant(attempt.percentage)}>{attempt.percentage}%</Badge>
                            </TableCell>
                            <TableCell>{new Date(attempt.attemptedAt).toLocaleString("vi-VN")}</TableCell>
                            <TableCell>
                              {attempt.feedback ? (
                                <Badge variant="outline">
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Có
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Chưa có</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => fetchAttemptDetail(attempt.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                                  {selectedAttempt && (
                                    <>
                                      <DialogHeader>
                                        <DialogTitle>Chi tiết bài làm</DialogTitle>
                                      </DialogHeader>

                                      <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h3 className="font-semibold">{selectedAttempt.quizTitle}</h3>
                                            <p className="text-muted-foreground text-sm">
                                              {new Date(selectedAttempt.attemptedAt).toLocaleString("vi-VN")}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-2xl font-bold">
                                              {selectedAttempt.score}/{selectedAttempt.totalScore}
                                            </div>
                                            <Badge variant={getScoreBadgeVariant(selectedAttempt.percentage)}>
                                              {selectedAttempt.percentage}%
                                            </Badge>
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <h4 className="font-semibold">Câu hỏi và câu trả lời</h4>
                                          {selectedAttempt.questions.map((question, idx) => (
                                            <Card
                                              key={question.id}
                                              className={
                                                question.isCorrect
                                                  ? "border-green-200 bg-green-50/50"
                                                  : "border-red-200 bg-red-50/50"
                                              }
                                            >
                                              <CardHeader>
                                                <div className="flex items-start gap-2">
                                                  {question.isCorrect ? (
                                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                                                  ) : (
                                                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                                  )}
                                                  <div>
                                                    <CardTitle className="text-base">
                                                      Câu {idx + 1}: {question.text}
                                                    </CardTitle>
                                                  </div>
                                                </div>
                                              </CardHeader>
                                              <CardContent className="space-y-2">
                                                {question.options.map((option) => {
                                                  const isStudentAnswer = option.id === question.studentAnswer;
                                                  const isCorrectAnswer = option.id === question.correctAnswer;

                                                  return (
                                                    <div
                                                      key={option.id}
                                                      className={`rounded border p-2 ${
                                                        isCorrectAnswer
                                                          ? "border-green-500 bg-green-100"
                                                          : isStudentAnswer
                                                            ? "border-red-500 bg-red-100"
                                                            : "border-gray-200"
                                                      }`}
                                                    >
                                                      <div className="flex items-center gap-2">
                                                        {isStudentAnswer && (
                                                          <span className="text-xs font-semibold">[Đã chọn]</span>
                                                        )}
                                                        {isCorrectAnswer && (
                                                          <span className="text-xs font-semibold text-green-600">
                                                            [Đáp án đúng]
                                                          </span>
                                                        )}
                                                        <span>{option.text}</span>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>

                                        <div className="space-y-4 border-t pt-4">
                                          <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">Nhận xét của giáo viên</Label>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={handleGenerateAIFeedback}
                                              disabled={generating}
                                            >
                                              <Sparkles className="mr-2 h-4 w-4" />
                                              {generating ? "Đang tạo..." : "Tạo bằng AI"}
                                            </Button>
                                          </div>
                                          <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Nhập nhận xét cho học viên..."
                                            rows={8}
                                            className="resize-none"
                                          />
                                          <div className="flex justify-end">
                                            <Button
                                              onClick={handleSubmitFeedback}
                                              disabled={submitting || !feedback.trim()}
                                            >
                                              {submitting ? "Đang lưu..." : "Lưu nhận xét"}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
