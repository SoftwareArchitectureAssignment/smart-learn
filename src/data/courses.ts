import type { ICourse } from "@/types/course.type";
import type { IVideoContent, IDocumentContent, IQuizContent } from "@/types/content.type";

// Simple mock courses for listing (without full content structure)
export const mockCourses: ICourse[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch.",
    instructor: "John Doe",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    createdAt: "2025-01-01T00:00:00Z",
    sections: [],
  },
  {
    id: 2,
    title: "Advanced React & TypeScript",
    description: "Master React with TypeScript, including hooks, context, and advanced patterns.",
    instructor: "Jane Smith",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    createdAt: "2025-01-05T00:00:00Z",
    sections: [],
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Explore data analysis, visualization, and machine learning with Python.",
    instructor: "Michael Chen",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    createdAt: "2025-01-10T00:00:00Z",
    sections: [],
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    description: "Learn to create beautiful and user-friendly interfaces with modern design principles.",
    instructor: "Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    createdAt: "2025-01-12T00:00:00Z",
    sections: [],
  },
  {
    id: 5,
    title: "Node.js Backend Development",
    description: "Build scalable server-side applications with Node.js, Express, and MongoDB.",
    instructor: "David Wilson",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    createdAt: "2025-01-15T00:00:00Z",
    sections: [],
  },
  {
    id: 6,
    title: "Mobile App Development with Flutter",
    description: "Create cross-platform mobile applications using Flutter and Dart.",
    instructor: "Emily Brown",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    createdAt: "2025-01-18T00:00:00Z",
    sections: [],
  },
  {
    id: 7,
    title: "DevOps & Cloud Computing",
    description: "Master Docker, Kubernetes, AWS, and CI/CD pipelines for modern DevOps.",
    instructor: "Robert Taylor",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
    createdAt: "2025-01-20T00:00:00Z",
    sections: [],
  },
  {
    id: 8,
    title: "Database Design & SQL",
    description: "Learn database fundamentals, SQL queries, and database optimization techniques.",
    instructor: "Lisa Anderson",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
    createdAt: "2025-01-22T00:00:00Z",
    sections: [],
  },
];

// Mock data with full structure: Course -> Sections -> Contents (Video/Document/Quiz) -> Questions
export const mockCourseWithContent: ICourse = {
  id: 1,
  title: "Lập trình Python từ cơ bản đến nâng cao",
  description: "Khóa học toàn diện về Python, từ cơ bản đến nâng cao với nhiều bài tập thực hành",
  instructor: "Nguyễn Văn A",
  thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
  createdAt: "2025-01-15T00:00:00Z",
  sections: [
    {
      id: 1,
      title: "Chương 1: Giới thiệu về Python",
      orderIndex: 1,
      contents: [
        {
          id: 1,
          title: "Tổng quan về Python",
          type: "video",
          orderIndex: 1,
          url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          duration: 930, // 15 minutes 30 seconds
          description: "Video giới thiệu tổng quan về ngôn ngữ lập trình Python và ứng dụng",
        } as IVideoContent,
        {
          id: 2,
          title: "Cài đặt môi trường Python",
          type: "document",
          orderIndex: 2,
          fileUrl: "https://docs.python.org/3/tutorial/",
          fileType: "pdf",
          fileSize: 2621440, // 2.5 MB
          description: "Hướng dẫn chi tiết cách cài đặt Python và các công cụ cần thiết",
        } as IDocumentContent,
        {
          id: 3,
          title: "Kiểm tra kiến thức cơ bản",
          type: "quiz",
          orderIndex: 3,
          description: "Kiểm tra kiến thức cơ bản về Python",
          durationMinutes: 30,
          passingScore: 70,
          questions: [
            {
              id: 1,
              content: "Python là ngôn ngữ lập trình gì?",
              type: "MULTIPLE_CHOICE",
              points: 2,
              options: [
                { id: 1, content: "Ngôn ngữ bậc cao, thông dịch", isCorrect: true },
                { id: 2, content: "Ngôn ngữ bậc thấp, biên dịch", isCorrect: false },
                { id: 3, content: "Ngôn ngữ Assembly", isCorrect: false },
                { id: 4, content: "Ngôn ngữ máy", isCorrect: false },
              ],
              explanation: "Python là ngôn ngữ lập trình bậc cao, được thông dịch (interpreted)",
            },
            {
              id: 2,
              content: "Python có hỗ trợ lập trình hướng đối tượng không?",
              type: "TRUE_FALSE",
              points: 1,
              options: [
                { id: 5, content: "Đúng", isCorrect: true },
                { id: 6, content: "Sai", isCorrect: false },
              ],
              explanation: "Python hỗ trợ nhiều paradigm lập trình, bao gồm lập trình hướng đối tượng",
            },
            {
              id: 3,
              content: "Phiên bản Python hiện tại được khuyến nghị sử dụng là gì?",
              type: "SHORT_ANSWER",
              points: 2,
              correctAnswer: "Python 3",
              explanation: "Python 3 là phiên bản hiện tại và được khuyến nghị sử dụng",
            },
          ],
        } as IQuizContent,
      ],
    },
    {
      id: 2,
      title: "Chương 2: Cú pháp cơ bản",
      orderIndex: 2,
      contents: [
        {
          id: 4,
          title: "Biến và kiểu dữ liệu",
          type: "video",
          orderIndex: 1,
          url: "https://www.youtube.com/watch?v=example1",
          duration: 1200, // 20 minutes
          description: "Học về các kiểu dữ liệu cơ bản trong Python: int, float, string, boolean",
        } as IVideoContent,
        {
          id: 5,
          title: "Toán tử và biểu thức",
          type: "video",
          orderIndex: 2,
          url: "https://www.youtube.com/watch?v=example2",
          duration: 900, // 15 minutes
          description: "Các toán tử số học, logic và so sánh trong Python",
        } as IVideoContent,
        {
          id: 6,
          title: "Bài tập thực hành - Biến và toán tử",
          type: "document",
          orderIndex: 3,
          fileUrl: "https://example.com/exercises.pdf",
          fileType: "pdf",
          fileSize: 1048576, // 1 MB
          description: "Bài tập thực hành về biến và toán tử",
        } as IDocumentContent,
        {
          id: 7,
          title: "Quiz: Kiểu dữ liệu và toán tử",
          type: "quiz",
          orderIndex: 4,
          description: "Kiểm tra hiểu biết về kiểu dữ liệu và toán tử",
          durationMinutes: 20,
          passingScore: 75,
          questions: [
            {
              id: 4,
              content: "Kết quả của phép toán 10 / 3 trong Python 3 là gì?",
              type: "MULTIPLE_CHOICE",
              points: 2,
              options: [
                { id: 7, content: "3", isCorrect: false },
                { id: 8, content: "3.33", isCorrect: false },
                { id: 9, content: "3.3333333333333335", isCorrect: true },
                { id: 10, content: "Lỗi cú pháp", isCorrect: false },
              ],
              explanation: "Toán tử / trong Python 3 luôn trả về số thực (float division)",
            },
            {
              id: 5,
              content: "Toán tử // trong Python dùng để làm gì?",
              type: "MULTIPLE_CHOICE",
              points: 2,
              options: [
                { id: 11, content: "Chia lấy dư", isCorrect: false },
                { id: 12, content: "Chia lấy phần nguyên", isCorrect: true },
                { id: 13, content: "Chia thông thường", isCorrect: false },
                { id: 14, content: "Lũy thừa", isCorrect: false },
              ],
              explanation: "Toán tử // là floor division, chia lấy phần nguyên",
            },
            {
              id: 6,
              content: "Biến trong Python có cần khai báo kiểu dữ liệu không?",
              type: "TRUE_FALSE",
              points: 1,
              options: [
                { id: 15, content: "Đúng", isCorrect: false },
                { id: 16, content: "Sai", isCorrect: true },
              ],
              explanation: "Python là ngôn ngữ dynamic typing, không cần khai báo kiểu dữ liệu",
            },
          ],
        } as IQuizContent,
      ],
    },
    {
      id: 3,
      title: "Chương 3: Cấu trúc điều khiển",
      orderIndex: 3,
      contents: [
        {
          id: 8,
          title: "Câu lệnh if-else",
          type: "video",
          orderIndex: 1,
          url: "https://www.youtube.com/watch?v=example3",
          duration: 1080, // 18 minutes
          description: "Cấu trúc rẽ nhánh với if, elif, else",
        } as IVideoContent,
        {
          id: 9,
          title: "Vòng lặp for và while",
          type: "video",
          orderIndex: 2,
          url: "https://www.youtube.com/watch?v=example4",
          duration: 1500, // 25 minutes
          description: "Các vòng lặp trong Python và cách sử dụng",
        } as IVideoContent,
        {
          id: 10,
          title: "Tài liệu về vòng lặp nâng cao",
          type: "document",
          orderIndex: 3,
          fileUrl: "https://example.com/loops-advanced.pdf",
          fileType: "pdf",
          fileSize: 3145728, // 3 MB
          description: "List comprehension, generator expressions và các kỹ thuật nâng cao",
        } as IDocumentContent,
        {
          id: 11,
          title: "Bài kiểm tra: Cấu trúc điều khiển",
          type: "quiz",
          orderIndex: 4,
          description: "Đánh giá hiểu biết về các cấu trúc điều khiển",
          durationMinutes: 25,
          passingScore: 80,
          questions: [
            {
              id: 7,
              content: "Vòng lặp nào phù hợp để duyệt qua các phần tử của list?",
              type: "MULTIPLE_CHOICE",
              points: 2,
              options: [
                { id: 17, content: "for", isCorrect: true },
                { id: 18, content: "while", isCorrect: false },
                { id: 19, content: "do-while", isCorrect: false },
                { id: 20, content: "switch", isCorrect: false },
              ],
              explanation: "Vòng lặp for là lựa chọn tốt nhất để duyệt qua các phần tử của sequence",
            },
            {
              id: 8,
              content: "Từ khóa nào dùng để thoát khỏi vòng lặp?",
              type: "SHORT_ANSWER",
              points: 1,
              correctAnswer: "break",
              explanation: "Từ khóa break dùng để thoát khỏi vòng lặp ngay lập tức",
            },
            {
              id: 9,
              content: "Python có hỗ trợ câu lệnh switch-case không?",
              type: "TRUE_FALSE",
              points: 1,
              options: [
                { id: 21, content: "Đúng", isCorrect: false },
                { id: 22, content: "Sai", isCorrect: true },
              ],
              explanation:
                "Python không có switch-case, sử dụng if-elif-else hoặc dictionary mapping (Python 3.10+ có match-case)",
            },
            {
              id: 10,
              content: "List comprehension có thể thay thế vòng lặp for không?",
              type: "TRUE_FALSE",
              points: 1,
              options: [
                { id: 23, content: "Đúng", isCorrect: true },
                { id: 24, content: "Sai", isCorrect: false },
              ],
              explanation: "List comprehension là cách viết ngắn gọn và hiệu quả hơn của vòng lặp for để tạo list",
            },
          ],
        } as IQuizContent,
      ],
    },
  ],
};

// Additional mock courses with content
export const mockCoursesWithContent: ICourse[] = [
  mockCourseWithContent,
  {
    id: 2,
    title: "React & TypeScript từ đầu",
    description: "Học React và TypeScript một cách bài bản và chuyên nghiệp",
    instructor: "Trần Thị B",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    createdAt: "2025-02-01T00:00:00Z",
    sections: [
      {
        id: 4,
        title: "Chương 1: React Basics",
        orderIndex: 1,
        contents: [
          {
            id: 12,
            title: "Giới thiệu React",
            type: "video",
            orderIndex: 1,
            url: "https://www.youtube.com/watch?v=example5",
            duration: 1800,
            description: "Tổng quan về React và JSX",
          } as IVideoContent,
          {
            id: 13,
            title: "Components và Props",
            type: "video",
            orderIndex: 2,
            url: "https://www.youtube.com/watch?v=example6",
            duration: 2100,
            description: "Cách tạo và sử dụng components",
          } as IVideoContent,
          {
            id: 14,
            title: "Quiz: React Fundamentals",
            type: "quiz",
            orderIndex: 3,
            description: "Kiểm tra kiến thức cơ bản về React",
            durationMinutes: 15,
            passingScore: 70,
            questions: [
              {
                id: 11,
                content: "JSX là gì?",
                type: "MULTIPLE_CHOICE",
                points: 2,
                options: [
                  { id: 25, content: "JavaScript XML", isCorrect: true },
                  { id: 26, content: "Java Syntax Extension", isCorrect: false },
                  { id: 27, content: "JSON eXtended", isCorrect: false },
                  { id: 28, content: "JavaScript eXternal", isCorrect: false },
                ],
                explanation: "JSX là JavaScript XML, cho phép viết HTML-like syntax trong JavaScript",
              },
            ],
          } as IQuizContent,
        ],
      },
    ],
  },
];
