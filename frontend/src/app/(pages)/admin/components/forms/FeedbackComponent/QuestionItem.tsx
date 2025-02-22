import React from 'react';
import { Post } from './types';

interface QuestionItemProps {
  post: Post;
  isSelected: boolean;
  onToggle: (questionId: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ post, isSelected, onToggle }) => {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-red-500 bg-red-50' 
          : 'border-zinc-200 hover:border-red-200'
      }`}
      onClick={() => onToggle(post.id)}
    >
      <div className="flex flex-row items-start gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-zinc-700">{post.text}</h4>
          <div className="flex flex-row gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
              {post.questionType}
            </span>
            <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
              {post.category}
            </span>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border ${
          isSelected 
            ? 'bg-red-500 border-red-500' 
            : 'border-zinc-300'
        }`}>
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;