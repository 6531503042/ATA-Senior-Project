
export interface Project {
  id: number;
  name: string;
  members: { id: number; name: string }[];
}

export interface Question {
  id: number;
  text: string;
  type: string;
}

export interface Feedback {
  id: number;
  name: string;
  projectId: number;
  description: string;
  feedbackStartDate: string;
  feedbackEndDate: string;
  status: "active" | "completed" | "upcoming";
  questionIds: number[];
  responseCount: number;
}
