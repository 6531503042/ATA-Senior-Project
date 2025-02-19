
export interface Answer {
  text: string;
  value: string;
}

export interface Question {
  id: number;
  text: string;
  content: string;
  required: boolean;
  type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  category: "GENERAL" | "WORK_ENVIRONMENT" | "MANAGEMENT" | "CAREER_GROWTH";
  answerType: "SATISFACTION_BASE" | "AGREEMENT_BASE" | "TEXT_BASE";
  answers: Answer[];
}
