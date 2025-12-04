"use client";

import Link from "next/link";
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface AssessmentReviewClientProps {
  learningPath: {
    id: string;
    title: string;
    assessmentAttempt: {
      score: number;
      totalScore: number;
      totalQuestions: number;
      answers: Record<string, string>;
      topicName: string;
    };
  };
  questions: Question[];
}

export function AssessmentReviewClient({ learningPath, questions }: AssessmentReviewClientProps) {
  const { assessmentAttempt } = learningPath;
  const percentage = Math.round((assessmentAttempt.score / assessmentAttempt.totalScore) * 100);
  const answers = assessmentAttempt.answers;

  const correctCount = questions.filter((question) => {
    const selectedOptionId = answers[question.id];
    const correctOption = question.options.find((opt) => opt.isCorrect);
    return selectedOptionId === correctOption?.id;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/student/learning-paths">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="mr-1 size-4" />
            Back to Learning Paths
          </Button>
        </Link>

        {/* Result Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assessment Review</CardTitle>
                <CardDescription>{assessmentAttempt.topicName} Assessment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">{percentage}%</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {correctCount}/{assessmentAttempt.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {assessmentAttempt.score}/{assessmentAttempt.totalScore}
                  </p>
                  <p className="text-sm text-gray-600">Points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Review</h2>
          {questions.map((question, index) => {
            const selectedOptionId = answers[question.id];
            const correctOption = question.options.find((opt) => opt.isCorrect);
            const isCorrect = selectedOptionId === correctOption?.id;

            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.text}
                    </CardTitle>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="mr-1 size-3" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="mr-1 size-3" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrectAnswer = option.isCorrect;

                    return (
                      <div
                        key={option.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50"
                            : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex size-6 items-center justify-center">
                          {isCorrectAnswer ? (
                            <CheckCircle className="size-5 text-green-600" />
                          ) : isSelected ? (
                            <XCircle className="size-5 text-red-600" />
                          ) : (
                            <div className="size-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.text}</p>
                          {isCorrectAnswer && <p className="mt-1 text-sm text-green-700">✓ Correct Answer</p>}
                          {isSelected && !isCorrectAnswer && <p className="mt-1 text-sm text-red-700">✗ Your Answer</p>}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Link href="/student/learning-paths" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Learning Paths
            </Button>
          </Link>
          <Link href="/student/learning-paths/assessment" className="flex-1">
            <Button className="w-full">Take Another Assessment</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
