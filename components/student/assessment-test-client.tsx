"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, CheckCircle2, ChevronLeft, Loader2, Timer, XCircle, Trophy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Topic {
  id: string;
  name: string;
  description: string | null;
}

interface AssessmentQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    order: number;
  }[];
}

interface DetailedResult {
  questionId: string;
  questionText: string;
  userAnswerId: string;
  correctAnswerId: string;
  isCorrect: boolean;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface AssessmentTestClientProps {
  topics: Topic[];
  initialTopicId?: string;
  initialCount?: number;
}

type AssessmentStep = "config" | "testing" | "result" | "review";

export function AssessmentTestClient({ topics, initialTopicId, initialCount }: AssessmentTestClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<AssessmentStep>("config");
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopicId || "");
  const [questionCount, setQuestionCount] = useState<number>(initialCount || 10);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Auto-start if params are provided
  useEffect(() => {
    if (initialTopicId && initialCount && step === "config") {
      handleStartAssessment();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (step === "testing" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartAssessment = async () => {
    if (!selectedTopic || questionCount < 5) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/assessment-questions/random?topicId=${selectedTopic}&count=${questionCount}`);

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data);
      setTimeRemaining(questionCount * 60); // 1 minute per question
      setStep("testing");
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load assessment questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/assessment-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: selectedTopic,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      const data = await response.json();
      setResult(data);
      setStep("result");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Config screen
  if (step === "config") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/student/learning-paths">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 size-4" />
              Back to Learning Paths
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="size-6" />
                Take Assessment Test
              </CardTitle>
              <CardDescription>
                Choose a topic and number of questions to test your knowledge and get personalized course
                recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Select Topic</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Choose a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTopic && (
                  <p className="text-sm text-gray-600">{topics.find((t) => t.id === selectedTopic)?.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Questions</Label>
                <Input
                  id="count"
                  type="number"
                  min={5}
                  max={50}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                />
                <p className="text-sm text-gray-600">Estimated time: {questionCount} minutes (1 min per question)</p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900">Assessment Instructions</h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• You have 1 minute per question</li>
                  <li>• You can navigate back and forth between questions</li>
                  <li>• Your answers are automatically saved</li>
                  <li>• Based on your results, we'll recommend a personalized learning path</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link href="/student/learning-paths" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={handleStartAssessment}
                  disabled={!selectedTopic || questionCount < 5 || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading Questions...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 size-4" />
                      Start Assessment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Testing screen
  if (step === "testing" && currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/student/learning-paths">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-1 size-4" />
                Back to Learning Paths
              </Button>
            </Link>
            <Badge variant="outline" className={timeRemaining < 60 ? "border-red-500 text-red-600" : ""}>
              <Timer className="mr-1 size-3" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <CardDescription>{topics.find((t) => t.id === selectedTopic)?.name} Assessment</CardDescription>

              {/* Progress bar */}
              <div className="flex items-center gap-2 pt-2">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{currentQuestion.text}</h3>

                <div className="space-y-3">
                  {currentQuestion.options
                    .sort((a, b) => a.order - b.order)
                    .map((option) => {
                      const isSelected = answers[currentQuestion.id] === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                            isSelected ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                            className="mt-1"
                          />
                          <span className="flex-1">{option.text}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t pt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  Previous
                </Button>

                <div className="text-sm text-gray-600">
                  {answeredCount} of {questions.length} answered
                </div>

                {isLastQuestion ? (
                  <Button
                    onClick={handleSubmitAssessment}
                    disabled={answeredCount !== questions.length || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Assessment"
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Result screen
  if (step === "result" && result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/student/learning-paths">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 size-4" />
              Back to Learning Paths
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Complete!</CardTitle>
              <CardDescription>Your personalized learning path has been generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                {result.percentage >= 80 ? (
                  <div className="rounded-full bg-green-100 p-6">
                    <Trophy className="size-20 text-green-600" />
                  </div>
                ) : result.percentage >= 60 ? (
                  <div className="rounded-full bg-blue-100 p-6">
                    <Brain className="size-20 text-blue-600" />
                  </div>
                ) : (
                  <div className="rounded-full bg-yellow-100 p-6">
                    <Brain className="size-20 text-yellow-600" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-3xl font-bold">
                    {result.percentage >= 80
                      ? "Excellent Work!"
                      : result.percentage >= 60
                        ? "Good Job!"
                        : "Great Start!"}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {result.percentage >= 80
                      ? "You've demonstrated advanced knowledge"
                      : result.percentage >= 60
                        ? "You have a solid foundation"
                        : "There's room to grow"}
                  </p>
                </div>

                <div className="flex items-center gap-12 text-center">
                  <div>
                    <p className="text-4xl font-bold">{result.percentage}%</p>
                    <p className="text-sm text-gray-600">Your Score</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">
                      {result.score}/{result.totalScore}
                    </p>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                </div>
              </div>

              {result.learningPath && (
                <div className="rounded-lg border bg-green-50 p-4">
                  <h4 className="font-semibold text-green-900">🎉 Learning Path Generated</h4>
                  <p className="mt-2 text-sm text-green-800">
                    Based on your assessment results, we've created a personalized learning path with{" "}
                    {result.learningPath.coursesCount} recommended courses.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("review")} className="flex-1">
                  <Eye className="mr-2 size-4" />
                  Review Answers
                </Button>
                <Button onClick={() => router.push("/student/learning-paths")} className="flex-1">
                  View Learning Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Review screen
  if (step === "review" && result && result.detailedResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/student/learning-paths">
            <Button variant="ghost" size="sm" className="mb-4">
              <ChevronLeft className="mr-1 size-4" />
              Back to Learning Paths
            </Button>
          </Link>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Review Your Answers</CardTitle>
                  <CardDescription>See which questions you got right and wrong</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {result.score}/{result.totalScore}
                  </p>
                  <p className="text-sm text-gray-600">{result.percentage}%</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {result.detailedResults.map((item: DetailedResult, index: number) => {
              return (
                <Card key={item.questionId} className={item.isCorrect ? "border-green-200" : "border-red-200"}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-semibold">Question {index + 1}</CardTitle>
                      {item.isCorrect ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle2 className="mr-1 size-3" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="mr-1 size-3" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{item.questionText}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.options.map((option) => {
                      const isUserAnswer = option.id === item.userAnswerId;
                      const isCorrectAnswer = option.id === item.correctAnswerId;

                      let borderColor = "";
                      let bgColor = "";
                      let icon = null;

                      if (isCorrectAnswer) {
                        borderColor = "border-green-500";
                        bgColor = "bg-green-50";
                        icon = <CheckCircle2 className="size-5 text-green-600" />;
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        borderColor = "border-red-500";
                        bgColor = "bg-red-50";
                        icon = <XCircle className="size-5 text-red-600" />;
                      }

                      return (
                        <div
                          key={option.id}
                          className={`flex items-start gap-3 rounded-lg border-2 p-3 ${borderColor} ${bgColor}`}
                        >
                          <div className="mt-0.5">{icon}</div>
                          <div className="flex-1">
                            <p className="text-sm">{option.text}</p>
                            {isUserAnswer && !isCorrectAnswer && (
                              <p className="mt-1 text-xs text-red-600">Your answer</p>
                            )}
                            {isCorrectAnswer && <p className="mt-1 text-xs text-green-600">Correct answer</p>}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep("result")} className="flex-1">
              Back to Results
            </Button>
            <Button onClick={() => router.push("/student/learning-paths")} className="flex-1">
              View Learning Path
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
