"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Trophy } from "lucide-react";

interface QuizAttemptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: any;
  contentTitle: string;
}

export function QuizAttemptDialog({
  open,
  onOpenChange,
  quiz,
  contentTitle,
}: QuizAttemptDialogProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;
  const hasAnsweredCurrent = !!answers[currentQuestion?.id];

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      setResult(data);
      router.refresh();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    onOpenChange(false);
  };

  if (!quiz) return null;

  // Show result screen
  if (result) {
    const passed = result.score >= (quiz.passingScore || 0);
    const percentage = Math.round((result.score / result.totalScore) * 100);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quiz Result</DialogTitle>
            <DialogDescription>{contentTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {passed ? (
                <div className="rounded-full bg-green-100 p-4">
                  <Trophy className="size-16 text-green-600" />
                </div>
              ) : (
                <div className="rounded-full bg-red-100 p-4">
                  <XCircle className="size-16 text-red-600" />
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  {passed ? "Congratulations!" : "Keep Trying!"}
                </h3>
                <p className="mt-2 text-gray-600">
                  {passed
                    ? "You passed the quiz!"
                    : "You didn't pass this time, but don't give up!"}
                </p>
              </div>

              <div className="flex items-center gap-8 text-center">
                <div>
                  <p className="text-3xl font-bold">{percentage}%</p>
                  <p className="text-sm text-gray-600">Your Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{result.score}/{result.totalScore}</p>
                  <p className="text-sm text-gray-600">Points</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{quiz.passingScore}%</p>
                  <p className="text-sm text-gray-600">Passing Score</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleClose} className="flex-1">
                Close
              </Button>
              <Button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                variant="outline"
                className="flex-1"
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show quiz questions
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{contentTitle}</DialogTitle>
          <DialogDescription>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQuestion?.text}</h3>
            
            <div className="space-y-2">
              {currentQuestion?.options.map((option: any) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    className="mt-1"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-600">
              {Object.keys(answers).length} of {quiz.questions.length} answered
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
