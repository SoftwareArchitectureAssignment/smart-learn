"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAssessmentQuestionDialog } from "./add-assessment-question-dialog";
import { EditAssessmentQuestionDialog } from "./edit-assessment-question-dialog";

interface Topic {
  id: string;
  name: string;
  description: string | null;
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
  createdAt: string;
  updatedAt: string;
}

export function AssessmentQuestionsClient() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch("/api/topics");
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/assessment-questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(`/api/assessment-questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === "all" || question.topics.some((t) => t.topic.id === selectedTopic);
    return matchesSearch && matchesTopic;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTopic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} disabled={topics.length === 0}>
              <Plus className="mr-2 size-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="min-w-64 flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Questions Table */}
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                {questions.length === 0
                  ? "No questions yet. Add your first question."
                  : "No questions match your filters."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2">{question.text}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.topics.map((t) => (
                            <Badge key={t.topic.id} variant="secondary">
                              {t.topic.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{question.options.length} options</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(question.id)}>
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredQuestions.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredQuestions.length)} of {filteredQuestions.length}{" "}
                questions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                    })
                    .map((page, index, array) => {
                      // Add ellipsis between non-consecutive pages
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-9"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddAssessmentQuestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        topics={topics}
        onSuccess={() => {
          fetchQuestions();
          setIsAddDialogOpen(false);
        }}
      />

      {editingQuestion && (
        <EditAssessmentQuestionDialog
          open={!!editingQuestion}
          onOpenChange={(open) => !open && setEditingQuestion(null)}
          question={editingQuestion}
          topics={topics}
          onSuccess={() => {
            fetchQuestions();
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}
