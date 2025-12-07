import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TestConfig, TestQuestion } from "@/types/learning-path.type";

const TakeTest = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state?.config as TestConfig;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(config?.timeLimit * 60 || 1800); // in seconds

  // Mock questions - replace with actual API call
  const questions: TestQuestion[] = Array.from({ length: config?.numberOfQuestions || 20 }, (_, i) => ({
    id: `${i + 1}`,
    question: `Question ${i + 1}: What is the main purpose of ${config?.topic}?`,
    options: [
      "Option A: First possible answer",
      "Option B: Second possible answer",
      "Option C: Third possible answer",
      "Option D: Fourth possible answer",
    ],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: "This is an explanation of the correct answer and why other options are incorrect.",
  }));

  useEffect(() => {
    if (!config) {
      navigate(`/student/learning-paths/${pathId}/placement-test`);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config, navigate, pathId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);

    navigate(`/student/learning-paths/${pathId}/placement-test/result`, {
      state: {
        score,
        totalQuestions: questions.length,
        correctAnswers,
        timeSpent: config.timeLimit * 60 - timeRemaining,
        config,
      },
    });
  };

  if (!config) {
    return null;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header with Timer */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.topic} Test</h1>
          <p className="text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
          <Clock className="size-5 text-blue-600" />
          <span className="text-lg font-semibold text-blue-600">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                answers[currentQuestion] === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-6 items-center justify-center rounded-full border-2 ${
                    answers[currentQuestion] === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {answers[currentQuestion] === index && <CheckCircle className="size-4 text-white" />}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`size-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? "bg-blue-500 text-white"
                    : answers[index] !== undefined
                      ? "border border-green-300 bg-green-100 text-green-700"
                      : "border border-gray-300 bg-gray-100 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <div className="flex gap-3">
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNext}>Next Question</Button>
          ) : (
            <Button onClick={handleSubmitTest} disabled={answers.length < questions.length}>
              Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
