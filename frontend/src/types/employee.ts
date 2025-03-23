// Answer types
export interface Answer {
  text: string;
  value: string;
}

// Question types
export interface ValidationRules {
  maxQuestions: number;
  requiresComments: boolean;
  minQuestions: number;
}

export interface Question {
  id: number;
  text: string;
  content: string;
  required: boolean;
  type: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'SENTIMENT' | 'TEXT_BASED';
  category: string;
  answerType: string;
  answers: Answer[];
  description: string;
  validationRules: ValidationRules | null;
}

// Feedback types
export interface FeedbackSubmission {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  validationRules: ValidationRules;
}

export interface FeedbackFormProps {
  id: string;
}

// Component Props Types
export interface QuestionCardProps {
  question: Question;
  currentAnswer: string | string[];
  onAnswerChange: (value: string | string[]) => void;
  questionNumber: number;
  totalQuestions: number;
}

export interface FeedbackStepProps {
  title: string;
  description: string;
}

export interface FeedbackStepperProps {
  steps: FeedbackStepProps[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

// Submission Types
export interface FeedbackResponse {
  [questionId: string]: string;
}

export interface FeedbackSubmissionPayload {
  feedbackId: number;
  responses: FeedbackResponse;
  overallComments: string;
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
}

// State Types
export interface FeedbackFormState {
  feedback: FeedbackSubmission | null;
  currentStep: number;
  answers: Record<number, string | string[]>;
  overallComments: string;
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'ANONYMOUS';
  loading: boolean;
  submitting: boolean;
}
