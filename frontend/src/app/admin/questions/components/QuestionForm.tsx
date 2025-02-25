'use client';

import React, { useState } from 'react';
import { QuestionType, QuestionCategory, CreateQuestionDto, Question } from '../models/types';
import {
  MessageCircleQuestion,
  Code,
  Users,
  ClipboardList,
  MessageSquare,
  CheckSquare,
  ListChecks,
  Star,
  Plus,
  Trash2,
  Rocket,
  X,
  Briefcase,
  Heart,
  ThumbsUp,
  Target,
  Lightbulb,
  GraduationCap,
  MessagesSquare
} from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (data: CreateQuestionDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Question;
  mode: 'create' | 'edit';
}

interface OptionItem {
  text: string;
}

const categoryOptions = [
  { 
    value: QuestionCategory.GENERAL, 
    label: "General", 
    icon: MessageCircleQuestion,
    description: "General feedback and questions"
  },
  { 
    value: QuestionCategory.WORK_ENVIRONMENT, 
    label: "Work Environment", 
    icon: Briefcase,
    description: "Workspace and office environment feedback"
  },
  { 
    value: QuestionCategory.WORK_LIFE_BALANCE, 
    label: "Work Life Balance", 
    icon: Heart,
    description: "Balance between work and personal life"
  },
  { 
    value: QuestionCategory.TEAM_COLLABORATION, 
    label: "Team Collaboration", 
    icon: Users,
    description: "Team dynamics and collaboration feedback"
  },
  { 
    value: QuestionCategory.PROJECT_MANAGEMENT, 
    label: "Project Management", 
    icon: ClipboardList,
    description: "Project planning and execution feedback"
  },
  { 
    value: QuestionCategory.PROJECT_SATISFACTION, 
    label: "Project Satisfaction", 
    icon: ThumbsUp,
    description: "Overall project satisfaction feedback"
  },
  { 
    value: QuestionCategory.TECHNICAL_SKILLS, 
    label: "Technical Skills", 
    icon: Code,
    description: "Technical abilities and knowledge assessment"
  },
  { 
    value: QuestionCategory.COMMUNICATION, 
    label: "Communication", 
    icon: MessagesSquare,
    description: "Communication effectiveness feedback"
  },
  { 
    value: QuestionCategory.LEADERSHIP, 
    label: "Leadership", 
    icon: Target,
    description: "Leadership and guidance assessment"
  },
  { 
    value: QuestionCategory.INNOVATION, 
    label: "Innovation", 
    icon: Lightbulb,
    description: "Innovation and creative thinking feedback"
  },
  { 
    value: QuestionCategory.PERSONAL_GROWTH, 
    label: "Personal Growth", 
    icon: GraduationCap,
    description: "Personal development and growth assessment"
  }
];

const questionTypeOptions = [
  { value: QuestionType.SINGLE_CHOICE, label: "Single Choice", icon: CheckSquare },
  { value: QuestionType.MULTIPLE_CHOICE, label: "Multiple Choice", icon: ListChecks },
  { value: QuestionType.SENTIMENT, label: "Sentiment", icon: Star },
  { value: QuestionType.TEXT_BASED, label: "Text", icon: MessageSquare },
];

const sentimentEmojis = [
  { sentiment: 'Negative', emoji: '😞', color: 'text-red-500', bg: 'bg-red-50' },
  { sentiment: 'Neutral', emoji: '😐', color: 'text-gray-500', bg: 'bg-gray-50' },
  { sentiment: 'Positive', emoji: '😊', color: 'text-green-500', bg: 'bg-green-50' },
];

interface SelectWithIconProps<T extends string> {
  options: Array<{
    value: T;
    label: string;
    icon: React.ElementType;
    description?: string;
  }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}

function SelectWithIcon<T extends string>({ options, value, onChange, label }: SelectWithIconProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value);
  const Icon = selectedOption?.icon;
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} title={option.description}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <div className="h-4 w-4 text-gray-400">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      {selectedOption?.description && (
        <p className="mt-1 text-xs text-gray-500">{selectedOption.description}</p>
      )}
    </div>
  );
}

export function QuestionForm({ onSubmit, onCancel, isLoading, initialData, mode }: QuestionFormProps) {
  const [formData, setFormData] = useState<CreateQuestionDto>(
    initialData ? {
      text: initialData.text,
      description: initialData.description,
      questionType: initialData.questionType,
      category: initialData.category,
      choices: initialData.choices || [],
    } : {
      text: '',
      description: '',
      questionType: QuestionType.SINGLE_CHOICE,
      category: QuestionCategory.GENERAL,
      choices: [],
    }
  );

  const [options, setOptions] = useState<OptionItem[]>(
    formData.choices?.map(choice => ({ text: choice })) || [{ text: '' }, { text: '' }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      choices: formData.questionType === QuestionType.TEXT_BASED ? [] :
               formData.questionType === QuestionType.SENTIMENT ? ['NEGATIVE', 'NEUTRAL', 'POSITIVE'] :
               options.map(opt => opt.text)
    };
    onSubmit(submitData);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { text: value };
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <MessageCircleQuestion className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Question' : 'Create New Question'}
                </h2>
                <p className="text-sm text-gray-500">
                  {mode === 'edit' ? 'Update existing question' : 'Add a new question for feedback collection'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  rows={3}
                  placeholder="Add additional context"
                  required
                />
              </div>
            </div>

            {/* Type and Category Selection */}
            <div className="grid grid-cols-2 gap-4">
              <SelectWithIcon
                options={questionTypeOptions}
                value={formData.questionType}
                onChange={(value: QuestionType) => setFormData({ ...formData, questionType: value })}
                label="Question Type"
              />

              <SelectWithIcon
                options={categoryOptions}
                value={formData.category}
                onChange={(value: QuestionCategory) => setFormData({ ...formData, category: value })}
                label="Category"
              />
            </div>

            {/* Answer Options */}
            {formData.questionType === QuestionType.SENTIMENT ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Sentiment Options</label>
                <div className="grid grid-cols-3 gap-4">
                  {sentimentEmojis.map(({ sentiment, emoji, color, bg }) => (
                    <div
                      key={sentiment}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 ${bg} transition-shadow hover:shadow-md`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span className={`text-sm font-medium ${color}`}>{sentiment}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : formData.questionType !== QuestionType.TEXT_BASED && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 w-8">{index + 1}.</span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-violet-300 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Add Option</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || 
                  !formData.text.trim() || 
                  !formData.description.trim() || 
                  (formData.questionType !== QuestionType.TEXT_BASED && 
                   formData.questionType !== QuestionType.SENTIMENT && 
                   (!options || options.length < 2 || options.some(opt => !opt.text.trim())))
                }
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="h-4 w-4" />
                {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Question' : 'Create Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 