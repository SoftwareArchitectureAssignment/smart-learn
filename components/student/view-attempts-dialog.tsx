"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface ViewAttemptsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attempts: any[];
  contentTitle: string;
  passingScore: number;
}

export function ViewAttemptsDialog({
  open,
  onOpenChange,
  attempts,
  contentTitle,
  passingScore,
}: ViewAttemptsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz Attempts</DialogTitle>
          <DialogDescription>{contentTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {attempts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No attempts yet. Take the quiz to see your results here!
            </p>
          ) : (
            attempts.map((attempt, index) => {
              const percentage = Math.round((attempt.score / attempt.totalScore) * 100);
              const passed = percentage >= passingScore;

              return (
                <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    {passed ? (
                      <CheckCircle className="size-8 text-green-600" />
                    ) : (
                      <XCircle className="size-8 text-red-600" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Attempt #{attempts.length - index}</p>
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
                        <span>{format(new Date(attempt.attemptedAt), "MMM dd, yyyy HH:mm")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{percentage}%</p>
                    <p className="text-sm text-gray-600">
                      {attempt.score}/{attempt.totalScore}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
