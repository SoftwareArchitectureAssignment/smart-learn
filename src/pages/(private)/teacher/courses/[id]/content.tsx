import { useState, useEffect } from "react";
import { mockCourseWithContent } from "@/data/courses";
import type { ICourse } from "@/types/course.type";
import type { ISection } from "@/types/section.type";
import type { IContent, ContentType } from "@/types/content.type";
import type { IQuestion } from "@/types/question.type";
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  FileQuestion,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Clock,
  BookOpen,
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

// UI Interface for managing sections with expanded state
interface UISection extends ISection {
  isExpanded: boolean;
}

// Helper functions to format data
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Convert ICourse sections to UI sections with expanded state
const convertToUISections = (sections: ISection[]): UISection[] => {
  return sections.map((section, index) => ({
    ...section,
    isExpanded: index === 0, // First section expanded by default
  }));
};

interface CourseContentProps {
  course?: ICourse;
}

export default function CourseContent({}: CourseContentProps) {
  const [sections, setSections] = useState<UISection[]>([]);

  // Initialize sections from mock data
  useEffect(() => {
    setSections(convertToUISections(mockCourseWithContent.sections));
  }, []);

  const [editMode, setEditMode] = useState(false);

  // Section modal state
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  // Content modal state
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [editingSectionForContent, setEditingSectionForContent] = useState<number | null>(null);
  const [contentData, setContentData] = useState({
    title: "",
    type: "video" as ContentType,
    duration: "",
    description: "",
    fileSize: "",
    url: "",
    // Quiz fields
    questions: [] as IQuestion[],
    passingScore: 70,
    timeLimit: 30,
  });

  // View quiz modal state
  const [viewQuizModalOpen, setViewQuizModalOpen] = useState(false);
  const [viewingQuizItem, setViewingQuizItem] = useState<IContent | null>(null);

  const toggleSection = (sectionId: number) => {
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

  const handleEditSection = (sectionId: number, title: string) => {
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
      const newSection: UISection = {
        id: Date.now(),
        title: sectionTitle,
        orderIndex: sections.length + 1,
        contents: [],
        isExpanded: true,
      };
      setSections((prev) => [...prev, newSection]);
    }
    setSectionModalOpen(false);
    setSectionTitle("");
  };

  const handleDeleteSection = (sectionId: number) => {
    if (confirm("Bạn có chắc muốn xóa chương này?")) {
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
    }
  };

  // Content handlers
  const handleAddContent = (sectionId: number) => {
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

  const handleEditContent = (sectionId: number, item: IContent) => {
    setEditingContentId(item.id);
    setEditingSectionForContent(sectionId);

    if (item.type === "video") {
      setContentData({
        title: item.title,
        type: item.type,
        duration: formatDuration(item.duration),
        description: item.description || "",
        fileSize: "",
        url: item.url,
        questions: [],
        passingScore: 70,
        timeLimit: 30,
      });
    } else if (item.type === "document") {
      setContentData({
        title: item.title,
        type: item.type,
        duration: "",
        description: item.description || "",
        fileSize: item.fileSize ? formatFileSize(item.fileSize) : "",
        url: item.fileUrl,
        questions: [],
        passingScore: 70,
        timeLimit: 30,
      });
    } else if (item.type === "quiz") {
      setContentData({
        title: item.title,
        type: item.type,
        duration: "",
        description: item.description,
        fileSize: "",
        url: "",
        questions: item.questions,
        passingScore: item.passingScore,
        timeLimit: item.durationMinutes,
      });
    }
    setContentModalOpen(true);
  };

  const handleSaveContent = () => {
    if (!contentData.title.trim() || !editingSectionForContent) return;

    let newItem: IContent;
    const orderIndex = editingContentId
      ? sections.find((s) => s.id === editingSectionForContent)?.contents.find((c) => c.id === editingContentId)
          ?.orderIndex || 1
      : (sections.find((s) => s.id === editingSectionForContent)?.contents.length || 0) + 1;

    if (contentData.type === "video") {
      // Parse duration from MM:SS to seconds
      const [mins, secs] = contentData.duration.split(":").map(Number);
      const durationInSeconds = (mins || 0) * 60 + (secs || 0);

      newItem = {
        id: editingContentId || Date.now(),
        title: contentData.title,
        type: "video",
        orderIndex,
        url: contentData.url,
        duration: durationInSeconds,
        description: contentData.description || undefined,
      };
    } else if (contentData.type === "document") {
      // Parse file size
      const fileSizeMatch = contentData.fileSize.match(/([0-9.]+)\s*(MB|KB|B)/i);
      let fileSizeInBytes = 0;
      if (fileSizeMatch) {
        const size = parseFloat(fileSizeMatch[1]);
        const unit = fileSizeMatch[2].toUpperCase();
        if (unit === "MB") fileSizeInBytes = size * 1024 * 1024;
        else if (unit === "KB") fileSizeInBytes = size * 1024;
        else fileSizeInBytes = size;
      }

      newItem = {
        id: editingContentId || Date.now(),
        title: contentData.title,
        type: "document",
        orderIndex,
        fileUrl: contentData.url,
        fileType: "pdf",
        fileSize: fileSizeInBytes || undefined,
        description: contentData.description || undefined,
      };
    } else {
      // quiz
      newItem = {
        id: editingContentId || Date.now(),
        title: contentData.title,
        type: "quiz",
        orderIndex,
        description: contentData.description,
        durationMinutes: contentData.timeLimit,
        passingScore: contentData.passingScore,
        questions: contentData.questions,
      };
    }

    setSections((prev) =>
      prev.map((section) => {
        if (section.id === editingSectionForContent) {
          if (editingContentId) {
            // Edit existing content
            return {
              ...section,
              contents: section.contents.map((item) => (item.id === editingContentId ? newItem : item)),
            };
          } else {
            // Add new content
            return {
              ...section,
              contents: [...section.contents, newItem],
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

  const handleDeleteContent = (sectionId: number, contentId: number) => {
    if (confirm("Bạn có chắc muốn xóa nội dung này?")) {
      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              contents: section.contents.filter((item) => item.id !== contentId),
            };
          }
          return section;
        }),
      );
    }
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return Play;
      case "document":
        return FileText;
      case "quiz":
        return FileQuestion;
      default:
        return FileText;
    }
  };

  const getContentColor = (type: ContentType) => {
    switch (type) {
      case "video":
        return "text-blue-600 bg-blue-50";
      case "document":
        return "text-red-600 bg-red-50";
      case "quiz":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getContentMeta = (item: IContent): string => {
    if (item.type === "video") {
      return formatDuration(item.duration);
    } else if (item.type === "document") {
      return item.fileSize ? formatFileSize(item.fileSize) : "";
    } else if (item.type === "quiz") {
      return `${item.questions.length} câu`;
    }
    return "";
  };

  const totalItems = sections.reduce((acc, section) => acc + section.contents.length, 0);

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
                  <p className="text-sm text-gray-600">{section.contents.length} nội dung</p>
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
                {section.contents.map((item) => {
                  const Icon = getContentIcon(item.type);
                  const colorClass = getContentColor(item.type);
                  const meta = getContentMeta(item);

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
                          {meta && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meta}
                            </span>
                          )}
                          {item.type === "video" && item.description && (
                            <span className="truncate">{item.description}</span>
                          )}
                          {item.type === "document" && item.description && (
                            <span className="truncate">{item.description}</span>
                          )}
                          {item.type === "quiz" && <span className="truncate">{item.description}</span>}
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

                        {/* View button for video/document with URL */}
                        {item.type === "video" && !editMode && (
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

                        {item.type === "document" && !editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => window.open(item.fileUrl, "_blank")}
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            Xem
                          </Button>
                        )}

                        {editMode && (
                          <>
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
                          </>
                        )}
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
              {editingContentId ? "Cập nhật thông tin nội dung" : "Thêm video, tài liệu, hoặc quiz vào chương"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div>
              <Label htmlFor="content-type">Loại nội dung *</Label>
              <Select
                value={contentData.type}
                onValueChange={(value) => setContentData({ ...contentData, type: value as ContentType })}
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
                  <SelectItem value="document">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Tài liệu / File</span>
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
            {(contentData.type === "video" || contentData.type === "document") && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="content-duration">
                      {contentData.type === "video" ? "Thời lượng (MM:SS)" : "Thời gian đọc"}
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
                      placeholder="VD: 2.5 MB"
                      value={contentData.fileSize}
                      onChange={(e) => setContentData({ ...contentData, fileSize: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content-url">{contentData.type === "video" ? "URL Video" : "URL File"}</Label>
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
              </>
            )}

            {contentData.type === "quiz" && (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="quiz-time-limit">Thời gian (phút) *</Label>
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
                          const newQuestion: IQuestion = {
                            id: Date.now(),
                            content: "",
                            type: "MULTIPLE_CHOICE",
                            points: 1,
                            options: [
                              { id: Date.now() + 1, content: "", isCorrect: true },
                              { id: Date.now() + 2, content: "", isCorrect: false },
                            ],
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
                            value={q.content}
                            onChange={(e) => {
                              const updated = [...contentData.questions];
                              updated[qIndex].content = e.target.value;
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
                                  if (!updated[qIndex].options) {
                                    updated[qIndex].options = [];
                                  }
                                  updated[qIndex].options!.push({
                                    id: Date.now(),
                                    content: "",
                                    isCorrect: false,
                                  });
                                  setContentData({ ...contentData, questions: updated });
                                }}
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Thêm lựa chọn
                              </Button>
                            </div>
                            {q.options?.map((option, oIndex) => (
                              <div key={option.id} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() => {
                                    const updated = [...contentData.questions];
                                    updated[qIndex].options = updated[qIndex].options!.map((opt, idx) => ({
                                      ...opt,
                                      isCorrect: idx === oIndex,
                                    }));
                                    setContentData({ ...contentData, questions: updated });
                                  }}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <Input
                                  placeholder={`Đáp án ${String.fromCharCode(65 + oIndex)}`}
                                  value={option.content}
                                  onChange={(e) => {
                                    const updated = [...contentData.questions];
                                    updated[qIndex].options![oIndex].content = e.target.value;
                                    setContentData({ ...contentData, questions: updated });
                                  }}
                                  className="flex-1"
                                />
                                {q.options && q.options.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      const updated = [...contentData.questions];
                                      updated[qIndex].options = updated[qIndex].options!.filter((_, i) => i !== oIndex);
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
            <DialogDescription>
              {viewingQuizItem?.type === "quiz" ? viewingQuizItem.description : "Xem nội dung bài kiểm tra"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            {/* Quiz Info */}
            {viewingQuizItem?.type === "quiz" && (
              <>
                <div className="grid grid-cols-3 gap-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div>
                    <p className="mb-1 text-xs text-gray-600">Thời gian làm bài</p>
                    <p className="font-semibold text-gray-900">{viewingQuizItem.durationMinutes} phút</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-600">Điểm đạt</p>
                    <p className="font-semibold text-gray-900">{viewingQuizItem.passingScore}%</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-600">Số câu hỏi</p>
                    <p className="font-semibold text-gray-900">{viewingQuizItem.questions.length} câu</p>
                  </div>
                </div>

                {/* Questions */}
                {viewingQuizItem.questions.length > 0 ? (
                  <div className="space-y-6">
                    {viewingQuizItem.questions.map((q, qIndex) => (
                      <div key={q.id} className="rounded-lg border bg-white p-4">
                        <div className="mb-3 flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-600">
                            {qIndex + 1}
                          </span>
                          <p className="flex-1 font-medium text-gray-900">{q.content}</p>
                        </div>

                        <div className="ml-9 space-y-2">
                          {q.options?.map((option, oIndex) => (
                            <div
                              key={option.id}
                              className={`flex items-start gap-2 rounded-lg border p-3 ${
                                option.isCorrect ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <span className="shrink-0 font-semibold text-gray-700">
                                {String.fromCharCode(65 + oIndex)}.
                              </span>
                              <span className={option.isCorrect ? "font-medium text-green-900" : "text-gray-700"}>
                                {option.content}
                              </span>
                              {option.isCorrect && (
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
              </>
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
                  const sectionWithQuiz = sections.find((s) =>
                    s.contents.some((item) => item.id === viewingQuizItem.id),
                  );
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
