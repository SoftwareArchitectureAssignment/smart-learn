import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TestConfig } from "@/types/learning-path.type";

const PlacementTest = () => {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState<TestConfig>({
    topic: "",
    difficulty: "MEDIUM",
    numberOfQuestions: 20,
    timeLimit: 30,
  });

  // Mock data - replace with actual API call
  const learningPath = {
    id: pathId,
    title: "Frontend Development Path",
    description: "Master modern frontend development with React, TypeScript, and more",
  };

  const topics = [
    "JavaScript Fundamentals",
    "React Basics",
    "TypeScript",
    "State Management",
    "Advanced React Patterns",
    "Performance Optimization",
  ];

  const handleStartTest = () => {
    if (!config.topic) {
      alert("Please select a topic");
      return;
    }
    navigate(`/student/learning-paths/${pathId}/placement-test/take`, { state: { config } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Placement Test</h1>
        <p className="mt-1 text-gray-500">{learningPath.title}</p>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-500 p-3">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-semibold text-gray-900">About the Placement Test</h3>
              <p className="text-sm text-gray-600">
                This test will assess your current knowledge level in the selected topic. Based on your performance,
                we'll recommend the most suitable courses in your learning path to help you progress efficiently.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Your Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic">Select Topic</Label>
            <Select value={config.topic} onValueChange={(value) => setConfig({ ...config, topic: value })}>
              <SelectTrigger id="topic">
                <SelectValue placeholder="Choose a topic to test" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={config.difficulty}
              onValueChange={(value) => setConfig({ ...config, difficulty: value as "EASY" | "MEDIUM" | "HARD" })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {config.difficulty === "EASY" && "Suitable for complete beginners"}
              {config.difficulty === "MEDIUM" && "For those with basic understanding"}
              {config.difficulty === "HARD" && "For advanced learners"}
            </p>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="questions">Number of Questions</Label>
            <Select
              value={config.numberOfQuestions.toString()}
              onValueChange={(value) => setConfig({ ...config, numberOfQuestions: parseInt(value) })}
            >
              <SelectTrigger id="questions">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
                <SelectItem value="30">30 questions</SelectItem>
                <SelectItem value="50">50 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <Label htmlFor="time">Time Limit (minutes)</Label>
            <Select
              value={config.timeLimit.toString()}
              onValueChange={(value) => setConfig({ ...config, timeLimit: parseInt(value) })}
            >
              <SelectTrigger id="time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <FileText className="size-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-lg font-semibold">{config.numberOfQuestions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <Clock className="size-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-lg font-semibold">{config.timeLimit} min</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <TrendingUp className="size-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-lg font-semibold">{config.difficulty}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(`/student/learning-paths`)}>
          Cancel
        </Button>
        <Button onClick={handleStartTest} disabled={!config.topic}>
          Start Test
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlacementTest;
