interface IRequest {
  question: string;
  question_uid: string;
}

interface IResponse {
  answer: string;
  question_uid: string;
  timestamp: string;
  model_name: string;
}

export async function getFeedbackApi({ question, question_uid }: IRequest): Promise<IResponse> {
  const res = await fetch("http://localhost:8000/ai/evaluate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, question_uid }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get feedback: ${res.statusText}`);
  }

  return res.json();
}
