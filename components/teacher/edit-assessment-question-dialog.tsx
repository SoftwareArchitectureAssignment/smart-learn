"use client";

import { useState } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Topic {
  id: string;
  name: string;
  icon?: string | null;
}

interface AssessmentOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface AssessmentQuestion {
  id: string;
  text: string;
  topics: { topic: Topic }[];
  options: AssessmentOption[];
}

interface EditAssessmentQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: AssessmentQuestion;
  topics: Topic[];
  onSuccess: () => void;
}

export function EditAssessmentQuestionDialog({
  open,
  onOpenChange,
  question,
  topics,
  onSuccess,
}: EditAssessmentQuestionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [questionText, setQuestionText] = useState(question.text);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(question.topics.map((t) => t.topic.id));
  const [options, setOptions] = useState(question.options);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]));
  };

  const handleAddOption = () => {
    const newOrder = Math.max(...options.map((o) => o.order), -1) + 1;
    setOptions([...options, { id: `temp-${Date.now()}`, text: "", isCorrect: false, order: newOrder }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: keyof AssessmentOption, value: string | boolean | number) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value === true) {
      // Only one correct answer
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert("Please enter question text");
      return;
    }

    if (selectedTopics.length === 0) {
      alert("Please select at least one topic");
      return;
    }

    const filledOptions = options.filter((opt) => opt.text.trim());
    if (filledOptions.length < 2) {
      alert("Please add at least 2 options");
      return;
    }

    if (!filledOptions.some((opt) => opt.isCorrect)) {
      alert("Please mark one option as correct");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/assessment-questions/${question.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: questionText,
          topicIds: selectedTopics,
          options: filledOptions.map((opt, idx) => ({
            id: opt.id.startsWith("temp-") ? undefined : opt.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            order: idx,
          })),
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update question");
      }
    } catch (error) {
      console.error("Failed to update question:", error);
      alert("Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assessment Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Topics * (Select at least 1)</Label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic.id}
                  variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {topic.icon && <span className="mr-1">{topic.icon}</span>}
                  {topic.name}
                  {selectedTopics.includes(topic.id) && <X className="ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options (minimum 2, only 1 correct answer) *</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="mr-2 size-4" />
                Add Option
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={option.isCorrect ? "default" : "outline"}
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => handleOptionChange(index, "isCorrect", true)}
                  title={option.isCorrect ? "Correct answer" : "Mark as correct"}
                >
                  <Check className="size-4" />
                </Button>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
