import questionsJson from "@/data/questions.json";
import type { 
  Question, 
  QuestionResponse, 
  CreateQuestionRequest, 
  UpdateQuestionRequest,
  QuestionStats 
} from "@/types/question";

// Mock API functions - ready to be replaced with real API calls
export async function getQuestions(): Promise<QuestionResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    questions: questionsJson.questions as Question[],
    stats: questionsJson.stats as QuestionStats,
    pagination: questionsJson.pagination
  };
}

export async function createQuestion(data: CreateQuestionRequest): Promise<Question> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newQuestion: Question = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    type: data.type,
    category: data.category,
    options: data.options,
    required: data.required,
    order: data.order || 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newQuestion;
}

export async function updateQuestion(data: UpdateQuestionRequest): Promise<Question> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real implementation, this would fetch the existing question and merge updates
  const updatedQuestion: Question = {
    id: data.id,
    title: data.title || "Updated Question",
    description: data.description,
    type: data.type || "text_based",
    category: data.category || "general",
    options: data.options,
    required: data.required || false,
    order: data.order || 1,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: new Date().toISOString()
  };
  
  return updatedQuestion;
}

export async function deleteQuestion(questionId: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real implementation, this would call the API to delete the question
  console.log(`Question ${questionId} deleted`);
}

export async function getQuestionStats(): Promise<QuestionStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return questionsJson.stats as QuestionStats;
}

// Helper function to format question type for display
export function formatQuestionType(type: string): string {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Helper function to format category for display
export function formatCategory(category: string): string {
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Helper function to get question type color
export function getQuestionTypeColor(type: string): string {
  switch (type) {
    case 'single_choice':
      return 'primary';
    case 'multiple_choice':
      return 'secondary';
    case 'text_based':
      return 'success';
    case 'rating':
      return 'warning';
    case 'boolean':
      return 'danger';
    default:
      return 'default';
  }
}

// Helper function to get category color
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'project_satisfaction':
      return 'primary';
    case 'technical_skills':
      return 'success';
    case 'communication':
      return 'warning';
    case 'leadership':
      return 'danger';
    case 'work_environment':
      return 'secondary';
    case 'work_life_balance':
      return 'default';
    case 'team_collaboration':
      return 'success';
    case 'general':
      return 'default';
    default:
      return 'default';
  }
}
