// QuestionSection.tsx
import React from 'react';
import { Post } from './types';
import QuestionItem from './QuestionItem';

interface QuestionSectionProps {
  postData: Post[];
  selectedQuestions: number[];
  onToggleQuestion: (questionId: number) => void;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  postData,
  selectedQuestions,
  onToggleQuestion,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl w-full font-semibold text-zinc-700">
        Select Questions
      </h3>
      <div className="flex flex-col p-2 gap-5 h-[300px] w-11/12 overflow-y-auto mt-3">
        {postData.map((post) => (
          <QuestionItem
            key={post.id}
            post={post}
            isSelected={selectedQuestions.includes(post.id)}
            onToggle={onToggleQuestion}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;