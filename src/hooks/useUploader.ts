import { useMutation } from "@tanstack/react-query";

import { uploadSingleApi } from "@/apis/upload/upload-single.api";

interface UseUploaderParams {
  onUploadSingleSuccess?: (data: string) => void;
  onUploadSingleError?: (error: Error) => void;
  // onUploadMultipleSuccess?: (data: string[]) => void;
  // onUploadMultipleError?: (error: Error) => void;
}

export default function useUploader({ onUploadSingleSuccess, onUploadSingleError }: UseUploaderParams = {}) {
  const singleMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const response = await uploadSingleApi({ file });
      return response.data.url;
    },
    onSuccess: (data) => {
      onUploadSingleSuccess?.(data);
    },
    onError: (error) => {
      onUploadSingleError?.(error);
    },
  });

  // const multipleMutation = useMutation({
  //   mutationFn: async ({ files }: { files: File[] }) => {
  //     const response = await uploadMultipleApi({ files });
  //     return response;
  //   },
  //   onSuccess: (data) => {
  //     onUploadMultipleSuccess?.(data);
  //   },
  //   onError: (error) => {
  //     onError?.(error);
  //   },
  // });

  return {
    uploadSingle: singleMutation.mutateAsync,
    isUploadingSingle: singleMutation.isPending,
    isSingleUploadSuccess: singleMutation.isSuccess,
    isSingleUploadError: singleMutation.isError,

    // uploadMultiple: multipleMutation.mutateAsync,
    // isUploadingMultiple: multipleMutation.isPending,
    // isMultipleUploadSuccess: multipleMutation.isSuccess,
    // isMultipleUploadError: multipleMutation.isError,
  };
}
