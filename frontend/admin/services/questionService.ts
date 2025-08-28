// Question Service Utilities

export function formatQuestionType(type: string): string {
  const typeMap: Record<string, string> = {
    'MULTIPLE_CHOICE': 'Multiple Choice',
    'SINGLE_CHOICE': 'Single Choice',
    'TEXT': 'Text',
    'RATING': 'Rating',
    'BOOLEAN': 'Yes/No',
    'SCALE': 'Scale',
  };
  return typeMap[type] || type;
}

export function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'GENERAL': 'General',
    'TECHNICAL': 'Technical',
    'FEEDBACK': 'Feedback',
    'SURVEY': 'Survey',
    'EVALUATION': 'Evaluation',
  };
  return categoryMap[category] || category;
}

export function getQuestionTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    'MULTIPLE_CHOICE': 'primary',
    'SINGLE_CHOICE': 'secondary',
    'TEXT': 'success',
    'RATING': 'warning',
    'BOOLEAN': 'danger',
    'SCALE': 'default',
  };
  return colorMap[type] || 'default';
}

export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    'GENERAL': 'primary',
    'TECHNICAL': 'secondary',
    'FEEDBACK': 'success',
    'SURVEY': 'warning',
    'EVALUATION': 'danger',
  };
  return colorMap[category] || 'default';
}
