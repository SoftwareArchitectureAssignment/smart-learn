import { AssessmentQuestionsClient } from "@/components/teacher/assessment-questions-client";

export default function TeacherSettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assessment Questions</h1>
        <p className="mt-2 text-gray-600">Manage assessment questions for student learning paths</p>
      </div>

      <AssessmentQuestionsClient />
    </div>
  );
}
