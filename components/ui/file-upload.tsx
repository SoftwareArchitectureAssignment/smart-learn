"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadSingleApi } from "@/apis/upload/upload-single.api";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  accept = "image/*",
  maxSize = 5,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept) {
      const acceptTypes = accept.split(",").map((type) => type.trim());
      const isValid = acceptTypes.some((type) => {
        if (type.startsWith(".")) {
          // File extension check
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else if (type.includes("*")) {
          // Wildcard MIME type check (e.g., "image/*", "video/*")
          const regex = new RegExp(type.replace("*", ".*"));
          return regex.test(file.type);
        } else {
          // Exact MIME type check
          return file.type === type;
        }
      });

      if (!isValid) {
        setError("Invalid file type");
        return;
      }
    }

    setIsUploading(true);

    try {
      const response = await uploadSingleApi({ file });
      if (response.success && response.data.url) {
        onChange(response.data.url);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = accept?.includes("image");
  const isVideo = accept?.includes("video");
  const isDocument = !isImage && !isVideo;

  if (value) {
    return (
      <div className="relative">
        <div className="group relative aspect-video overflow-hidden rounded-lg border bg-gray-100">
          {isImage && <img src={value} alt="Uploaded" className="size-full object-cover" />}
          {isVideo && (
            <video src={value} controls className="size-full object-cover">
              Your browser does not support the video tag.
            </video>
          )}
          {isDocument && (
            <div className="flex size-full flex-col items-center justify-center gap-3">
              <FileText className="size-16 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Document uploaded</p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
          )}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                <X className="mr-2 size-4" />
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"} ${disabled || isUploading ? "cursor-not-allowed opacity-50" : "hover:border-blue-400 hover:bg-blue-50"} `}
      >
        {isUploading ? (
          <>
            <Loader2 className="size-10 animate-spin text-blue-500" />
            <p className="mt-3 text-sm text-gray-600">Uploading...</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-blue-100 p-3">
              {isImage && <ImageIcon className="size-8 text-blue-600" />}
              {isVideo && <Video className="size-8 text-blue-600" />}
              {isDocument && <FileText className="size-8 text-blue-600" />}
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900">
              Drop your {isImage ? "image" : isVideo ? "video" : "document"} here, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {isImage && `PNG, JPG, GIF up to ${maxSize}MB`}
              {isVideo && `MP4, WebM, MOV up to ${maxSize}MB`}
              {isDocument && `PDF, DOC, DOCX, PPT, PPTX up to ${maxSize}MB`}
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
