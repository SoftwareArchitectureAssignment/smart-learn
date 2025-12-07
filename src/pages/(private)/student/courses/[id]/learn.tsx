import { useParams } from "react-router-dom";
import { Play, CheckCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CourseLearn = () => {
  const { id } = useParams();

  // Mock data - replace with actual API call
  const course = {
    id: id,
    title: "Introduction to React",
    description: "Learn the basics of React and build modern web applications",
    instructor: "John Doe",
    sections: [
      {
        id: "1",
        title: "Getting Started",
        lessons: [
          { id: "1", title: "Introduction to React", duration: "10:30", completed: true, locked: false },
          { id: "2", title: "Setting up the Environment", duration: "15:45", completed: true, locked: false },
          { id: "3", title: "Your First Component", duration: "20:15", completed: false, locked: false },
        ],
      },
      {
        id: "2",
        title: "React Fundamentals",
        lessons: [
          { id: "4", title: "JSX Syntax", duration: "18:20", completed: false, locked: false },
          { id: "5", title: "Props and State", duration: "25:30", completed: false, locked: false },
          { id: "6", title: "Event Handling", duration: "22:10", completed: false, locked: true },
        ],
      },
      {
        id: "3",
        title: "Advanced Concepts",
        lessons: [
          { id: "7", title: "Hooks Overview", duration: "30:00", completed: false, locked: true },
          { id: "8", title: "useEffect and Side Effects", duration: "28:45", completed: false, locked: true },
          { id: "9", title: "Custom Hooks", duration: "35:20", completed: false, locked: true },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-2 text-gray-500">{course.description}</p>
        <p className="mt-1 text-sm text-gray-600">Instructor: {course.instructor}</p>
      </div>

      {/* Course Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-900">
                <Play className="size-16 text-white opacity-50" />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Your First Component</h3>
                <p className="mt-2 text-gray-600">
                  In this lesson, you'll learn how to create your first React component and understand the component
                  architecture.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Button variant="outline">Previous Lesson</Button>
                <Button>Next Lesson</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Course Curriculum */}
        <div className="space-y-4">
          {course.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    disabled={lesson.locked}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                      lesson.locked
                        ? "cursor-not-allowed bg-gray-50 opacity-60"
                        : lesson.completed
                          ? "bg-green-50 hover:bg-green-100"
                          : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="size-5 shrink-0 text-green-600" />
                    ) : lesson.locked ? (
                      <Lock className="size-5 shrink-0 text-gray-400" />
                    ) : (
                      <Play className="size-5 shrink-0 text-blue-600" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${lesson.locked ? "text-gray-500" : "text-gray-900"}`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;
