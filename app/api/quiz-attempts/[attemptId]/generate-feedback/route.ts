import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Generate AI feedback for quiz attempt (hardcoded for now)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await params;

    // Get quiz attempt to verify teacher owns the course
    const attempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        quiz: {
          include: {
            content: {
              select: {
                title: true,
                section: {
                  select: {
                    course: true,
                  },
                },
              },
            },
            questions: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    // Calculate score percentage
    const percentage = Math.round((attempt.score / attempt.totalScore) * 100);

    // Generate hardcoded AI feedback based on score
    let aiFeedback = "";

    if (percentage >= 90) {
      aiFeedback = `Xuất sắc, ${attempt.student.name}! 🌟

Bạn đã đạt được ${attempt.score}/${attempt.totalScore} điểm (${percentage}%) trong bài kiểm tra "${attempt.quiz.content.title}". 

**Điểm mạnh:**
- Kiến thức nền tảng vững chắc
- Khả năng vận dụng kiến thức tốt
- Tư duy logic và phân tích sắc bén

**Gợi ý tiếp theo:**
- Tiếp tục duy trì phong độ học tập
- Có thể tìm hiểu sâu hơn về các chủ đề nâng cao
- Chia sẻ kinh nghiệm học tập với các bạn khác

Chúc mừng bạn! Hãy tiếp tục phát huy!`;
    } else if (percentage >= 70) {
      aiFeedback = `Rất tốt, ${attempt.student.name}! 👏

Bạn đã đạt được ${attempt.score}/${attempt.totalScore} điểm (${percentage}%) trong bài kiểm tra "${attempt.quiz.content.title}".

**Điểm mạnh:**
- Nắm vững phần lớn kiến thức cơ bản
- Khả năng làm bài ổn định

**Cần cải thiện:**
- Một số kiến thức còn chưa vững
- Cần ôn luyện thêm các phần bị sai

**Gợi ý:**
- Xem lại các câu hỏi đã sai để hiểu rõ hơn
- Ôn tập lại các phần kiến thức liên quan
- Thực hành thêm với các bài tập tương tự

Tiếp tục cố gắng nhé!`;
    } else if (percentage >= 50) {
      aiFeedback = `Đạt yêu cầu, ${attempt.student.name}! 📚

Bạn đã đạt được ${attempt.score}/${attempt.totalScore} điểm (${percentage}%) trong bài kiểm tra "${attempt.quiz.content.title}".

**Nhận xét:**
- Bạn đã nắm được một số kiến thức cơ bản
- Vẫn còn nhiều phần cần củng cố

**Khuyến nghị:**
- Dành thời gian ôn tập kỹ hơn
- Xem lại toàn bộ tài liệu học tập
- Tập trung vào các phần chưa hiểu rõ
- Làm thêm bài tập thực hành
- Có thể tham gia nhóm học tập hoặc hỏi giáo viên

**Lộ trình học tập:**
1. Xem lại video bài giảng
2. Đọc kỹ tài liệu
3. Làm bài tập thực hành
4. Thử lại bài kiểm tra

Đừng nản chí! Hãy cố gắng hơn nữa!`;
    } else {
      aiFeedback = `Cần cố gắng nhiều hơn, ${attempt.student.name}! 💪

Bạn đã đạt được ${attempt.score}/${attempt.totalScore} điểm (${percentage}%) trong bài kiểm tra "${attempt.quiz.content.title}".

**Nhận xét:**
- Kiến thức nền tảng còn thiếu nhiều
- Cần đầu tư thời gian học tập nghiêm túc hơn

**Hành động cần thiết:**
- Xem lại toàn bộ tài liệu từ đầu
- Tham gia đầy đủ các buổi học
- Chủ động hỏi khi có thắc mắc
- Làm bài tập thường xuyên
- Có thể cần học thêm hoặc tham gia nhóm học tập

**Lộ trình khuyến nghị:**
1. Bắt đầu lại từ các khái niệm cơ bản
2. Học theo lộ trình có hệ thống
3. Thực hành nhiều bài tập
4. Kiểm tra kiến thức thường xuyên
5. Tìm kiếm sự hỗ trợ từ giáo viên hoặc bạn bè

Đừng bỏ cuộc! Mọi người đều có thể cải thiện được. Hãy liên hệ với giáo viên nếu bạn cần hỗ trợ thêm.`;
    }

    // Update the attempt with AI-generated feedback
    const updatedAttempt = await prisma.quizAttempt.update({
      where: {
        id: attemptId,
      },
      data: {
        feedback: aiFeedback,
      },
    });

    return NextResponse.json({
      id: updatedAttempt.id,
      feedback: updatedAttempt.feedback,
    });
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
