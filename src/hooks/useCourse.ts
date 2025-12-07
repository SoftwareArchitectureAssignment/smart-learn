"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { getAllCoursesApi } from "@/apis/course/get-all-courses.api";
import type { ICourse } from "@/types/course.type";
import { createCourseApi } from "@/apis/course/create-course.api";

export function useCourse() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ICourse[]>({
    queryKey: ["projects"],
    queryFn: () => getAllCoursesApi(),
  });

  const createCourse = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await createCourseApi(data);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Course created successfully");
      return data;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create course");
    },
  });

  return {
    courses: data || [],
    isLoadingCourses: isLoading,
    errorLoadingCourses: error,

    createCourse: createCourse.mutateAsync,
    isCreatingCourse: createCourse.isPending,
    isCreateCourseError: createCourse.isError,
  };
}
