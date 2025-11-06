import type { Course } from "@/data/courses";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Trash2, Eye, EyeOff } from "lucide-react";

interface CourseSettingsProps {
  course: Course;
}

export default function CourseSettings({ course }: CourseSettingsProps) {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    duration: course.duration,
    level: course.level,
    price: course.price,
    category: course.category,
    status: course.status,
    thumbnail: course.thumbnail,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving course settings:", formData);
    setHasChanges(false);
  };

  const handlePublish = () => {
    handleChange("status", "Active");
    handleSave();
  };

  const handleUnpublish = () => {
    handleChange("status", "Draft");
    handleSave();
  };

  return (
    <div className="max-w-4xl">
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tên khóa học *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Nhập tên khóa học"
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Mô tả về khóa học"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instructor">Giảng viên</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => handleChange("instructor", e.target.value)}
                  placeholder="Tên giảng viên"
                />
              </div>

              <div>
                <Label htmlFor="duration">Thời lượng</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="VD: 8 weeks"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="VD: Web Development"
                />
              </div>

              <div>
                <Label htmlFor="level">Cấp độ</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleChange("level", value as Course["level"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing & Media */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Giá & Hình ảnh</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Giá (USD)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">URL hình ảnh đại diện</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleChange("thumbnail", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {formData.thumbnail && (
              <div className="mt-2">
                <Label>Xem trước</Label>
                <div className="mt-2 relative h-48 w-full rounded-lg overflow-hidden border">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x250?text=Invalid+Image";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Status & Visibility */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Trạng thái & Hiển thị</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Trạng thái khóa học</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as Course["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">
                {formData.status === "Active" && "Khóa học đang hiển thị công khai"}
                {formData.status === "Draft" && "Khóa học đang ở chế độ nháp"}
                {formData.status === "Completed" && "Khóa học đã hoàn thành"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              {formData.status === "Active" ? (
                <Button variant="outline" onClick={handleUnpublish} className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Hủy công khai
                </Button>
              ) : (
                <Button variant="default" onClick={handlePublish} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Công khai khóa học
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Course Statistics */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thống kê</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Học viên</p>
              <p className="text-2xl font-bold text-gray-900">{course.students.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">{course.rating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">${(course.students * course.price).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : course.status === "Draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {course.status}
              </span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Vùng nguy hiểm</h2>
          <p className="text-sm text-gray-600 mb-4">
            Xóa khóa học này sẽ xóa tất cả nội dung, học viên và dữ liệu liên quan. Hành động này không thể hoàn tác.
          </p>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Xóa khóa học
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between sticky bottom-0 bg-white border-t p-4 -mx-6 -mb-6">
          <Button variant="outline" disabled={!hasChanges}>
            Hủy thay đổi
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
