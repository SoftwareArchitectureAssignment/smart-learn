"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Award } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
}

interface RecentAttempt {
  id: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  percentage: number;
  attemptedAt: string;
  feedback: string | null;
}

interface StudentWithStats {
  student: Student;
  enrolledAt: string;
  quizStats: QuizStats;
  recentAttempts: RecentAttempt[];
}

export function CourseMembersClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [members, setMembers] = useState<StudentWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [courseId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    if (score >= 50) return "outline";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Users className="text-muted-foreground mb-4 h-12 w-12" />
          <p className="text-muted-foreground">Chưa có học viên nào đăng ký khóa học này</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members.length > 0
                ? (members.reduce((sum, m) => sum + m.quizStats.averageScore, 0) / members.length).toFixed(1)
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt làm bài</CardTitle>
            <Award className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.reduce((sum, m) => sum + m.quizStats.totalAttempts, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách học viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Lượt làm bài</TableHead>
                <TableHead className="text-center">Điểm TB</TableHead>
                <TableHead className="text-center">Điểm cao nhất</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {member.student.image ? (
                          <img src={member.student.image} alt={member.student.name || ""} />
                        ) : (
                          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-sm">
                            {member.student.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                      </Avatar>
                      <span className="font-medium">{member.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.student.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{member.quizStats.totalAttempts}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${getScoreColor(member.quizStats.averageScore)}`}>
                      {member.quizStats.averageScore.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getScoreBadgeVariant(member.quizStats.bestScore)}>
                      {member.quizStats.bestScore.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(member.enrolledAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/teacher/courses/${courseId}/members/${member.student.id}`)}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
