interface IRequest {
  topics: string;
  level: string;
  questions: string; // JSON string containing prompt, courses, and questions
}

interface IResponse {
  advice: string;
  recommendedLearningPaths: {
    course_name: string;
    course_uid: string;
    description: string;
  }[];
  explanation: string;
}

export async function createLearningPathApi({ topics, level, questions }: IRequest): Promise<IResponse> {
  const res = await fetch("http://localhost:8000/ai/learning-path", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topics,
      level,
      questions: questions, // Send as messages field
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create learning path: ${res.statusText}`);
  }

  return res.json();
}
