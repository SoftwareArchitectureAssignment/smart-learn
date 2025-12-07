import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TestConfig } from "@/types/learning-path.type";

const PlacementTest = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<TestConfig>({
    topic: "",
    difficulty: "MEDIUM",
    numberOfQuestions: 20,
    timeLimit: 30,
  });

  const topics = [
    "JavaScript Fundamentals",
    "React Basics",
    "TypeScript",
    "Node.js & Backend",
    "Database & SQL",
    "Python Programming",
    "Data Structures & Algorithms",
    "System Design",
  ];

  const handleStartTest = () => {
    if (!config.topic) {
      alert("Please select a topic");
      return;
    }
    navigate("/student/placement-test/take", { state: { config } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Placement Test</h1>
        <p className="mt-1 text-gray-500">Assess your skills and get personalized recommendations</p>
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
                we'll recommend the most suitable learning paths and courses to help you progress efficiently.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li>• Multiple choice questions</li>
                <li>• Timed test with countdown</li>
                <li>• Instant results with personalized recommendations</li>
                <li>• Suggested learning paths based on your score</li>
              </ul>
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
            <Label htmlFor="topic">Select Topic *</Label>
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
            <p className="text-sm text-gray-500">Choose the topic you want to be assessed on</p>
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
                <SelectItem value="EASY">Easy - Beginner Level</SelectItem>
                <SelectItem value="MEDIUM">Medium - Intermediate Level</SelectItem>
                <SelectItem value="HARD">Hard - Advanced Level</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {config.difficulty === "EASY" && "Suitable for complete beginners with no prior experience"}
              {config.difficulty === "MEDIUM" && "For those with basic understanding and some practice"}
              {config.difficulty === "HARD" && "For advanced learners with solid foundation"}
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
                <SelectItem value="10">10 questions (Quick assessment)</SelectItem>
                <SelectItem value="20">20 questions (Recommended)</SelectItem>
                <SelectItem value="30">30 questions (Comprehensive)</SelectItem>
                <SelectItem value="50">50 questions (In-depth)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Limit */}
          <div className="space-y-2">
            <Label htmlFor="time">Time Limit</Label>
            <Select
              value={config.timeLimit.toString()}
              onValueChange={(value) => setConfig({ ...config, timeLimit: parseInt(value) })}
            >
              <SelectTrigger id="time">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes (Recommended)</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Estimated time: ~{Math.ceil((config.numberOfQuestions * config.timeLimit) / config.numberOfQuestions)}{" "}
              seconds per question
            </p>
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
        <Button variant="outline" onClick={() => navigate("/student/learning-paths")}>
          Cancel
        </Button>
        <Button onClick={handleStartTest} disabled={!config.topic} size="lg">
          Start Test
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlacementTest;
