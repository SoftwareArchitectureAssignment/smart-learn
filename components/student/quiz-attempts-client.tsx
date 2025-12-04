"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface QuizAttemptsClientProps {
  quiz: any;
}

export function QuizAttemptsClient({ quiz }: QuizAttemptsClientProps) {
  const courseId = quiz.content.section.course.id;
  const passingScore = quiz.passingScore || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href={`/student/courses/${courseId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 size-4" />
            Back to Course
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Attempts</CardTitle>
            <CardDescription>{quiz.content.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total Attempts: {quiz.attempts.length}</div>
              <Link href={`/student/quiz/${quiz.id}/attempt`}>
                <Button>Take Quiz Again</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {quiz.attempts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Clock className="mb-4 size-16 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">No attempts yet</h3>
                <p className="mt-2 text-sm text-gray-600">Take the quiz to see your results here!</p>
              </CardContent>
            </Card>
          ) : (
            quiz.attempts.map((attempt: any, index: number) => {
              const percentage = Math.round((attempt.score / attempt.totalScore) * 100);
              const passed = percentage >= passingScore;

              return (
                <Card key={attempt.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {passed ? (
                          <div className="rounded-full bg-green-100 p-3">
                            <CheckCircle className="size-8 text-green-600" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-red-100 p-3">
                            <XCircle className="size-8 text-red-600" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Attempt #{quiz.attempts.length - index}</h3>
                            <Badge
                              className={
                                passed
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                              }
                            >
                              {passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="size-4" />
                            <span>{format(new Date(attempt.attemptedAt), "MMM dd, yyyy 'at' HH:mm")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-3xl font-bold">{percentage}%</p>
                          <p className="text-sm text-gray-600">
                            {attempt.score}/{attempt.totalScore} correct
                          </p>
                        </div>
                        <Link href={`/student/quiz/${quiz.id}/attempts/${attempt.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 size-4" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
