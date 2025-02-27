import React from "react";

interface QuestionFieldsProps {
  text: string;
  description: string;
  onTextChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const QuestionFields: React.FC<QuestionFieldsProps> = ({
  text,
  description,
  onTextChange,
  onDescriptionChange,
}) => {
  return (
    <>
      <div className="w-full flex flex-col">
        <h3 className="text-sm font-medium">Question Text</h3>
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter your question"
          className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
          required
        />
      </div>
      <div className="w-full flex flex-col">
        <h3 className="text-sm font-medium">Description</h3>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add additional context"
          className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
        />
      </div>
    </>
  );
};

export default QuestionFields;