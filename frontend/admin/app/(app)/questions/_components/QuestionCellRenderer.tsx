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
import {
  formatQuestionType,
  formatCategory,
  getQuestionTypeColor,
  getCategoryColor,
} from '@/services/questionService';

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
          <div className="p-2 rounded-lg shadow-sm">
            {getTypeIcon(question.type)}
          </div>
          <Chip
            className="font-medium capitalize shadow-sm"
            color={getQuestionTypeColor(question.type) as any}
            size="sm"
            variant="flat"
          >
            {formatQuestionType(question.type)}
          </Chip>
        </div>
      );

    case 'category':
      return (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg shadow-sm">
            <MessageSquareIcon className="w-4 h-4 text-blue-500" />
          </div>
          <Chip
            className="font-medium capitalize shadow-sm"
            color={getCategoryColor(question.category) as any}
            size="sm"
            variant="flat"
          >
            {formatCategory(question.category)}
          </Chip>
        </div>
      );

    case 'required':
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            isReadOnly
            color="primary"
            isSelected={question.required}
            size="sm"
          />
          <span className="text-sm font-medium text-default-700">
            {question.required ? 'Required' : 'Optional'}
          </span>
        </div>
      );

    case 'status':
      return (
        <Chip
          className="font-medium capitalize shadow-sm"
          color={question.isActive ? 'success' : 'default'}
          size="sm"
          variant="flat"
        >
          {question.isActive ? 'Active' : 'Inactive'}
        </Chip>
      );

    case 'actions':
      return (
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            className="text-default-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            size="sm"
            variant="light"
            onPress={() => onEdit?.(question)}
          >
            <EditIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            className="text-default-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
            size="sm"
            variant="light"
            onPress={() => onDelete?.(question.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return <span>-</span>;
  }
}
