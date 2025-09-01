import { Key } from 'react';
import { Chip, Button, Checkbox } from '@heroui/react';
import {
  EditIcon,
  TrashIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  StarIcon,
  ToggleLeftIcon,
} from 'lucide-react';

import { Question } from '@/types/question';

// Question utility functions
function formatQuestionType(type: string): string {
  if (!type) return 'Unknown';
  
  switch (type.toLowerCase()) {
    case 'single_choice':
      return 'Single Choice';
    case 'multiple_choice':
      return 'Multiple Choice';
    case 'text_based':
      return 'Text Based';
    case 'rating':
      return 'Rating';
    case 'boolean':
      return 'Boolean';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
}

function formatCategory(category: string): string {
  if (!category) return 'General';
  
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

function getQuestionTypeColor(type: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  switch (type?.toLowerCase()) {
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

function getCategoryColor(category: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
  switch (category?.toLowerCase()) {
    case 'general':
      return 'default';
    case 'technical':
      return 'primary';
    case 'feedback':
      return 'success';
    case 'survey':
      return 'warning';
    case 'assessment':
      return 'danger';
    default:
      return 'secondary';
  }
}

export type QuestionColumnKey =
  | 'question'
  | 'type'
  | 'category'
  | 'required'
  | 'status'
  | 'actions';

type QuestionCellRendererProps = {
  question: Question;
  columnKey: Key;
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: string) => void;
};

export default function QuestionCellRenderer({
  question,
  columnKey,
  onEdit,
  onDelete,
}: QuestionCellRendererProps) {
  const getTypeIcon = (type: Question['type']) => {
    switch (type) {
      case 'single_choice':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'multiple_choice':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'text_based':
        return <MessageSquareIcon className="w-4 h-4" />;
      case 'rating':
        return <StarIcon className="w-4 h-4" />;
      case 'boolean':
        return <ToggleLeftIcon className="w-4 h-4" />;
      default:
        return <MessageSquareIcon className="w-4 h-4" />;
    }
  };

  switch (columnKey) {
    case 'question':
      return (
        <div className="flex items-start gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            {getTypeIcon(question.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-default-900 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {question.title}
            </h3>
            {question.description && (
              <p className="text-xs text-default-500 line-clamp-2 leading-relaxed">
                {question.description}
              </p>
            )}
            {question.options && question.options.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-default-400 mb-1">Options:</p>
                <div className="flex flex-wrap gap-1">
                  {question.options.slice(0, 3).map((option, index) => (
                    <span
                      key={option.id}
                      className="text-xs bg-default-100 px-2 py-1 rounded-md"
                    >
                      {option.text}
                    </span>
                  ))}
                  {question.options.length > 3 && (
                    <span className="text-xs text-default-400">
                      +{question.options.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'type':
      return (
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            color={getQuestionTypeColor(question.type)}
            variant="flat"
            className="text-xs"
          >
            {formatQuestionType(question.type)}
          </Chip>
        </div>
      );

    case 'category':
      return (
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            color={getCategoryColor(question.category)}
            variant="flat"
            className="text-xs"
          >
            {formatCategory(question.category)}
          </Chip>
        </div>
      );

    case 'required':
      return (
        <Checkbox
          isSelected={question.required}
          isReadOnly
          size="sm"
        />
      );

    case 'status':
      return (
        <Chip
          size="sm"
          color={question.active ? 'success' : 'danger'}
          variant="flat"
          className="text-xs"
        >
          {question.active ? 'Active' : 'Inactive'}
        </Chip>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEdit(question)}
            >
              <EditIcon className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onDelete(question.id.toString())}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      );

    default:
      return null;
  }
}
