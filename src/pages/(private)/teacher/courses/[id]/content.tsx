import { useState } from "react";
import type { Course } from "@/data/courses";
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Image,
  FileQuestion,
  StickyNote,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Clock,
  BookOpen,
  Upload,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "file" | "image" | "note" | "quiz";
  duration?: string;
  description?: string;
  fileSize?: string;
  uploadDate?: Date;
  // For video/file
  url?: string;
  // For quiz
  questions?: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number; // in minutes
}

interface Section {
  id: string;
  title: string;
  items: ContentItem[];
  isExpanded: boolean;
}

const mockSections: Section[] = [
  {
    id: "1",
    title: "Chương 1: Giới thiệu",
    isExpanded: true,
    items: [
      {
        id: "1-1",
        title: "Video: Tổng quan Python",
        type: "video",
        duration: "15:30",
        uploadDate: new Date(2025, 9, 1),
        url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      },
      {
        id: "1-2",
        title: "Tài liệu: Cài đặt môi trường",
        type: "file",
        fileSize: "2.5 MB (PDF)",
        uploadDate: new Date(2025, 9, 2),
        url: "https://docs.python.org/3/tutorial/",
      },
      {
        id: "1-3",
        title: "Quiz: Kiểm tra kiến thức",
        type: "quiz",
        duration: "5 câu",
        description: "Kiểm tra kiến thức cơ bản về Python",
        uploadDate: new Date(2025, 9, 3),
        timeLimit: 30,
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "Python là ngôn ngữ lập trình gì?",
            options: ["Compiled", "Interpreted", "Assembly", "Machine code"],
            correctAnswer: 1,
            explanation: "Python là ngôn ngữ thông dịch (interpreted), mã nguồn được thực thi trực tiếp.",
          },
          {
            id: "q2",
            question: "Kiểu dữ liệu nào sau đây là immutable trong Python?",
            options: ["List", "Dictionary", "Tuple", "Set"],
            correctAnswer: 2,
            explanation: "Tuple là kiểu dữ liệu bất biến (immutable) trong Python.",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Chương 2: Biến và kiểu dữ liệu",
    isExpanded: false,
    items: [
      {
        id: "2-1",
        title: "Video: Biến trong Python",
        type: "video",
        duration: "20:15",
        uploadDate: new Date(2025, 9, 5),
        url: "https://www.youtube.com/watch?v=example2",
      },
      {
        id: "2-2",
        title: "Note: Ghi chú quan trọng",
        type: "note",
        description: "Các kiểu dữ liệu cơ bản trong Python",
        uploadDate: new Date(2025, 9, 6),
      },
      {
        id: "2-3",
        title: "Hình ảnh: Sơ đồ kiểu dữ liệu",
        type: "image",
        fileSize: "850 KB (PNG)",
        uploadDate: new Date(2025, 9, 7),
        url: "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Python+Data+Types",
      },
    ],
  },
  {
    id: "3",
    title: "Chương 3: Cấu trúc điều khiển",
    isExpanded: false,
    items: [
      {
        id: "3-1",
        title: "Video: If-else statement",
        type: "video",
        duration: "18:45",
        uploadDate: new Date(2025, 9, 10),
        url: "https://www.youtube.com/watch?v=example3",
      },
      {
        id: "3-2",
        title: "Tài liệu: Bài tập thực hành",
        type: "file",
        fileSize: "1.8 MB (PDF)",
        uploadDate: new Date(2025, 9, 11),
        url: "https://example.com/python-exercises.pdf",
      },
    ],
  },
];

interface CourseContentProps {
  course: Course;
}

export default function CourseContent({}: CourseContentProps) {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [editMode, setEditMode] = useState(false);

  // Section modal state
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  // Content modal state
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editingSectionForContent, setEditingSectionForContent] = useState<string | null>(null);
  const [contentData, setContentData] = useState({
    title: "",
    type: "video" as ContentItem["type"],
    duration: "",
    description: "",
    fileSize: "",
    url: "",
    // Quiz fields
    questions: [] as QuizQuestion[],
    passingScore: 70,
    timeLimit: 30,
  });

  // View quiz modal state
  const [viewQuizModalOpen, setViewQuizModalOpen] = useState(false);
  const [viewingQuizItem, setViewingQuizItem] = useState<ContentItem | null>(null);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section)),
    );
  };

  // Section handlers
  const handleAddSection = () => {
    setEditingSectionId(null);
    setSectionTitle("");
    setSectionModalOpen(true);
  };

  const handleEditSection = (sectionId: string, title: string) => {
    setEditingSectionId(sectionId);
    setSectionTitle(title);
    setSectionModalOpen(true);
  };

  const handleSaveSection = () => {
    if (!sectionTitle.trim()) return;

    if (editingSectionId) {
      // Edit existing section
      setSections((prev) =>
        prev.map((section) => (section.id === editingSectionId ? { ...section, title: sectionTitle } : section)),
      );
    } else {
      // Add new section
      const newSection: Section = {
        id: Date.now().toString(),
        title: sectionTitle,
        items: [],
        isExpanded: true,
      };
      setSections((prev) => [...prev, newSection]);
    }
    setSectionModalOpen(false);
    setSectionTitle("");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Bạn có chắc muốn xóa chương này?")) {
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
    }
  };

  // Content handlers
  const handleAddContent = (sectionId: string) => {
    setEditingContentId(null);
    setEditingSectionForContent(sectionId);
    setContentData({
      title: "",
      type: "video",
      duration: "",
      description: "",
      fileSize: "",
      url: "",
      questions: [],
      passingScore: 70,
      timeLimit: 30,
    });
    setContentModalOpen(true);
  };

  const handleEditContent = (sectionId: string, item: ContentItem) => {
    setEditingContentId(item.id);
    setEditingSectionForContent(sectionId);
    setContentData({
      title: item.title,
      type: item.type,
      duration: item.duration || "",
      description: item.description || "",
      fileSize: item.fileSize || "",
      url: item.url || "",
      questions: item.questions || [],
      passingScore: item.passingScore || 70,
      timeLimit: item.timeLimit || 30,
    });
    setContentModalOpen(true);
  };

  const handleSaveContent = () => {
    if (!contentData.title.trim() || !editingSectionForContent) return;

    const newItem: ContentItem = {
      id: editingContentId || Date.now().toString(),
      title: contentData.title,
      type: contentData.type,
      duration: contentData.duration || undefined,
      description: contentData.description || undefined,
      fileSize: contentData.fileSize || undefined,
      uploadDate: new Date(),
      url: contentData.url || undefined,
      questions: contentData.type === "quiz" ? contentData.questions : undefined,
      passingScore: contentData.type === "quiz" ? contentData.passingScore : undefined,
      timeLimit: contentData.type === "quiz" ? contentData.timeLimit : undefined,
    };

    setSections((prev) =>
      prev.map((section) => {
        if (section.id === editingSectionForContent) {
          if (editingContentId) {
            // Edit existing content
            return {
              ...section,
              items: section.items.map((item) => (item.id === editingContentId ? newItem : item)),
            };
          } else {
            // Add new content
            return {
              ...section,
              items: [...section.items, newItem],
            };
          }
        }
        return section;
      }),
    );

    setContentModalOpen(false);
    setContentData({
      title: "",
      type: "video",
      duration: "",
      description: "",
      fileSize: "",
      url: "",
      questions: [],
      passingScore: 70,
      timeLimit: 30,
    });
  };

  const handleDeleteContent = (sectionId: string, contentId: string) => {
    if (confirm("Bạn có chắc muốn xóa nội dung này?")) {
      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              items: section.items.filter((item) => item.id !== contentId),
            };
          }
          return section;
        }),
      );
    }
  };

  const getContentIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "video":
        return Play;
      case "file":
        return FileText;
      case "image":
        return Image;
      case "note":
        return StickyNote;
      case "quiz":
        return FileQuestion;
      default:
        return FileText;
    }
  };

  const getContentColor = (type: ContentItem["type"]) => {
    switch (type) {
      case "video":
        return "text-blue-600 bg-blue-50";
      case "file":
        return "text-red-600 bg-red-50";
      case "image":
        return "text-green-600 bg-green-50";
      case "note":
        return "text-yellow-600 bg-yellow-50";
      case "quiz":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);

  return (
    <div className="max-w-5xl">
      {/* Header Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tổng số chương</p>
              <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tổng nội dung</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Ngày cập nhật</p>
              <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {editMode ? "Xong" : "Chỉnh sửa"}
          </Button>
          <Button size="sm" className="flex items-center gap-2" onClick={handleAddSection}>
            <Plus className="h-4 w-4" />
            Thêm chương mới
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            {/* Section Header */}
            <div
              className={`flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 ${
                section.isExpanded ? "border-b" : ""
              }`}
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex flex-1 items-center gap-3">
                {editMode && <GripVertical className="h-5 w-5 cursor-move text-gray-400" />}
                <button className="text-gray-600 hover:text-gray-900">
                  {section.isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </button>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.items.length} nội dung</p>
                </div>
              </div>
              {editMode && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    onClick={() => handleEditSection(section.id, section.title)}
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Section Items */}
            {section.isExpanded && (
              <div className="bg-gray-50">
                {section.items.map((item) => {
                  const Icon = getContentIcon(item.type);
                  const colorClass = getContentColor(item.type);

                  return (
                    <div
                      key={item.id}
                      className="group flex items-center gap-3 border-b p-4 transition-colors last:border-b-0 hover:bg-white"
                    >
                      {editMode && <GripVertical className="h-4 w-4 cursor-move text-gray-400" />}

                      {/* Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                          {item.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.duration}
                            </span>
                          )}
                          {item.fileSize && <span className="text-gray-500">{item.fileSize}</span>}
                          {item.description && <span className="truncate">{item.description}</span>}
                          {item.uploadDate && !editMode && (
                            <span className="text-xs text-gray-400">
                              • {item.uploadDate.toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {/* View button for quiz */}
                        {item.type === "quiz" && !editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setViewingQuizItem(item);
                              setViewQuizModalOpen(true);
                            }}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Xem
                          </Button>
                        )}

                        {/* View button for video/file/image with URL */}
                        {(item.type === "video" || item.type === "file" || item.type === "image") &&
                          item.url &&
                          !editMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => window.open(item.url, "_blank")}
                            >
                              <ExternalLink className="mr-1 h-4 w-4" />
                              Xem
                            </Button>
                          )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => handleEditContent(section.id, item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => handleEditContent(section.id, item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 opacity-0 group-hover:opacity-100 hover:text-red-700"
                          onClick={() => handleDeleteContent(section.id, item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* Add Item Button */}
                {editMode && (
                  <button
                    className="flex w-full items-center gap-2 p-4 text-left text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
                    onClick={() => handleAddContent(section.id)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Thêm nội dung mới</span>
                  </button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Section Modal */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSectionId ? "Chỉnh sửa chương" : "Thêm chương mới"}</DialogTitle>
            <DialogDescription>
              {editingSectionId ? "Cập nhật thông tin chương học" : "Tạo chương mới cho khóa học của bạn"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="section-title">Tên chương *</Label>
              <Input
                id="section-title"
                placeholder="VD: Chương 1: Giới thiệu"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveSection} disabled={!sectionTitle.trim()}>
              {editingSectionId ? "Cập nhật" : "Thêm chương"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Modal */}
      <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle>{editingContentId ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}</DialogTitle>
            <DialogDescription>
              {editingContentId ? "Cập nhật thông tin nội dung" : "Thêm video, tài liệu, quiz hoặc ghi chú vào chương"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <Label htmlFor="content-type">Loại nội dung *</Label>
              <Select
                value={contentData.type}
                onValueChange={(value) => setContentData({ ...contentData, type: value as ContentItem["type"] })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-blue-600" />
                      <span>Video</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="file">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Tài liệu / File</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-green-600" />
                      <span>Hình ảnh</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="note">
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-yellow-600" />
                      <span>Ghi chú</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="quiz">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4 text-purple-600" />
                      <span>Quiz / Bài kiểm tra</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content-title">Tiêu đề *</Label>
              <Input
                id="content-title"
                placeholder="VD: Video: Giới thiệu về Python"
                value={contentData.title}
                onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Dynamic fields based on content type */}
            {(contentData.type === "video" || contentData.type === "file") && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="content-duration">
                      {contentData.type === "video" ? "Thời lượng" : "Thời gian đọc ước tính"}
                    </Label>
                    <Input
                      id="content-duration"
                      placeholder={contentData.type === "video" ? "VD: 15:30" : "VD: 10 phút"}
                      value={contentData.duration}
                      onChange={(e) => setContentData({ ...contentData, duration: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content-filesize">Kích thước</Label>
                    <Input
                      id="content-filesize"
                      placeholder="VD: 125 MB"
                      value={contentData.fileSize}
                      onChange={(e) => setContentData({ ...contentData, fileSize: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content-url">
                    {contentData.type === "video" ? "URL Video hoặc Upload" : "URL File hoặc Upload"}
                  </Label>
                  <Input
                    id="content-url"
                    placeholder="https://..."
                    value={contentData.url}
                    onChange={(e) => setContentData({ ...contentData, url: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content-description">Mô tả</Label>
                  <textarea
                    id="content-description"
                    placeholder="Mô tả ngắn về nội dung này..."
                    value={contentData.description}
                    onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                    className="mt-2 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* File Upload Section */}
                <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-600">Click để tải lên hoặc kéo thả file vào đây</p>
                  <p className="text-xs text-gray-500">
                    {contentData.type === "video" ? "MP4, MOV, AVI (Max 500MB)" : "PDF, DOC, PPT, XLSX (Max 50MB)"}
                  </p>
                </div>
              </>
            )}

            {contentData.type === "image" && (
              <>
                <div>
                  <Label htmlFor="content-url">URL Hình ảnh hoặc Upload</Label>
                  <Input
                    id="content-url"
                    placeholder="https://..."
                    value={contentData.url}
                    onChange={(e) => setContentData({ ...contentData, url: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content-description">Chú thích</Label>
                  <Input
                    id="content-description"
                    placeholder="Mô tả ngắn về hình ảnh..."
                    value={contentData.description}
                    onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                    className="mt-2"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-600">Click để tải lên hình ảnh</p>
                  <p className="text-xs text-gray-500">JPG, PNG, GIF, SVG (Max 10MB)</p>
                </div>
              </>
            )}

            {contentData.type === "note" && (
              <>
                <div>
                  <Label htmlFor="content-description">Nội dung ghi chú *</Label>
                  <textarea
                    id="content-description"
                    placeholder="Viết nội dung ghi chú quan trọng ở đây..."
                    value={contentData.description}
                    onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                    className="mt-2 min-h-40 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Hỗ trợ Markdown để định dạng văn bản</p>
                </div>
              </>
            )}

            {contentData.type === "quiz" && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quiz-time-limit">Thời gian làm bài (phút) *</Label>
                      <Input
                        id="quiz-time-limit"
                        type="number"
                        min="1"
                        placeholder="30"
                        value={contentData.timeLimit}
                        onChange={(e) => setContentData({ ...contentData, timeLimit: parseInt(e.target.value) || 30 })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-passing-score">Điểm đạt (%)</Label>
                      <Input
                        id="quiz-passing-score"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="70"
                        value={contentData.passingScore}
                        onChange={(e) =>
                          setContentData({ ...contentData, passingScore: parseInt(e.target.value) || 70 })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Số câu hỏi</Label>
                      <Input value={contentData.questions.length} disabled className="mt-2 bg-gray-100" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content-description">Mô tả bài kiểm tra</Label>
                    <textarea
                      id="content-description"
                      placeholder="Mô tả về nội dung và mục đích của bài kiểm tra..."
                      value={contentData.description}
                      onChange={(e) => setContentData({ ...contentData, description: e.target.value })}
                      className="mt-2 min-h-20 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Quiz Questions */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <Label className="text-base font-semibold">Câu hỏi ({contentData.questions.length})</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newQuestion: QuizQuestion = {
                            id: Date.now().toString(),
                            question: "",
                            options: ["", ""],
                            correctAnswer: 0,
                            explanation: "",
                          };
                          setContentData({
                            ...contentData,
                            questions: [...contentData.questions, newQuestion],
                          });
                        }}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Thêm câu hỏi
                      </Button>
                    </div>

                    <div className="max-h-96 space-y-4 overflow-y-auto">
                      {contentData.questions.map((q, qIndex) => (
                        <div key={q.id} className="space-y-3 rounded-lg border bg-white p-4">
                          <div className="flex items-start justify-between gap-2">
                            <Label className="text-sm font-semibold">Câu {qIndex + 1}</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 text-red-600 hover:text-red-700"
                              onClick={() => {
                                setContentData({
                                  ...contentData,
                                  questions: contentData.questions.filter((_, i) => i !== qIndex),
                                });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <Input
                            placeholder="Nhập câu hỏi..."
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...contentData.questions];
                              updated[qIndex].question = e.target.value;
                              setContentData({ ...contentData, questions: updated });
                            }}
                          />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-gray-600">Các đáp án (tối thiểu 2)</Label>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-6 text-blue-600 hover:text-blue-700"
                                onClick={() => {
                                  const updated = [...contentData.questions];
                                  updated[qIndex].options.push("");
                                  setContentData({ ...contentData, questions: updated });
                                }}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Thêm lựa chọn
                              </Button>
                            </div>
                            {q.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  checked={q.correctAnswer === oIndex}
                                  onChange={() => {
                                    const updated = [...contentData.questions];
                                    updated[qIndex].correctAnswer = oIndex;
                                    setContentData({ ...contentData, questions: updated });
                                  }}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <Input
                                  placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                                  value={option}
                                  onChange={(e) => {
                                    const updated = [...contentData.questions];
                                    updated[qIndex].options[oIndex] = e.target.value;
                                    setContentData({ ...contentData, questions: updated });
                                  }}
                                  className="flex-1"
                                />
                                {q.options.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      const updated = [...contentData.questions];
                                      updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== oIndex);
                                      // Adjust correctAnswer if needed
                                      if (updated[qIndex].correctAnswer === oIndex) {
                                        updated[qIndex].correctAnswer = 0;
                                      } else if (updated[qIndex].correctAnswer > oIndex) {
                                        updated[qIndex].correctAnswer--;
                                      }
                                      setContentData({ ...contentData, questions: updated });
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <p className="mt-1 text-xs text-gray-500">✓ Chọn radio button để đánh dấu đáp án đúng</p>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">Giải thích (tùy chọn)</Label>
                            <Input
                              placeholder="Giải thích đáp án đúng..."
                              value={q.explanation || ""}
                              onChange={(e) => {
                                const updated = [...contentData.questions];
                                updated[qIndex].explanation = e.target.value;
                                setContentData({ ...contentData, questions: updated });
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))}

                      {contentData.questions.length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                          <FileQuestion className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                          <p className="text-sm">Chưa có câu hỏi nào</p>
                          <p className="text-xs">Click "Thêm câu hỏi" để bắt đầu</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContentModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveContent} disabled={!contentData.title.trim()}>
              {editingContentId ? "Cập nhật" : "Thêm nội dung"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Quiz Modal */}
      <Dialog open={viewQuizModalOpen} onOpenChange={setViewQuizModalOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col">
          <DialogHeader>
            <DialogTitle>{viewingQuizItem?.title}</DialogTitle>
            <DialogDescription>{viewingQuizItem?.description || "Xem nội dung bài kiểm tra"}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {/* Quiz Info */}
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div>
                <p className="mb-1 text-xs text-gray-600">Thời gian làm bài</p>
                <p className="font-semibold text-gray-900">{viewingQuizItem?.timeLimit || 30} phút</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Điểm đạt</p>
                <p className="font-semibold text-gray-900">{viewingQuizItem?.passingScore || 70}%</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Số câu hỏi</p>
                <p className="font-semibold text-gray-900">{viewingQuizItem?.questions?.length || 0} câu</p>
              </div>
            </div>

            {/* Questions */}
            {viewingQuizItem?.questions && viewingQuizItem.questions.length > 0 ? (
              <div className="space-y-6">
                {viewingQuizItem.questions.map((q, qIndex) => (
                  <div key={q.id} className="rounded-lg border bg-white p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                        {qIndex + 1}
                      </span>
                      <p className="flex-1 font-medium text-gray-900">{q.question}</p>
                    </div>

                    <div className="ml-9 space-y-2">
                      {q.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-start gap-2 rounded-lg border p-3 ${
                            q.correctAnswer === oIndex ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <span className="shrink-0 font-semibold text-gray-700">
                            {String.fromCharCode(65 + oIndex)}.
                          </span>
                          <span className={q.correctAnswer === oIndex ? "font-medium text-green-900" : "text-gray-700"}>
                            {option}
                          </span>
                          {q.correctAnswer === oIndex && (
                            <span className="ml-auto text-xs font-semibold text-green-600">✓ Đáp án đúng</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 ml-9 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p className="mb-1 text-xs font-semibold text-blue-900">💡 Giải thích:</p>
                        <p className="text-sm text-blue-800">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <FileQuestion className="mx-auto mb-3 h-16 w-16 text-gray-300" />
                <p className="text-sm">Bài kiểm tra này chưa có câu hỏi</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewQuizModalOpen(false)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                setViewQuizModalOpen(false);
                if (viewingQuizItem) {
                  // Find the section containing this quiz
                  const sectionWithQuiz = sections.find((s) => s.items.some((item) => item.id === viewingQuizItem.id));
                  if (sectionWithQuiz) {
                    handleEditContent(sectionWithQuiz.id, viewingQuizItem);
                  }
                }
              }}
            >
              <Edit className="mr-1 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
