import { Plus, Trash2 } from "lucide-react";
import React from "react";

interface OptionItem {
  text: string;
}

interface AnswerOptionsProps {
  options: OptionItem[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (index: number, value: string) => void;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-medium mb-2">Answer Options</h3>
      <p className="text-sm text-zinc-500">
        Add possible answers for selection:
      </p>
      {options.map((option, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          <span className="text-sm font-medium text-zinc-500 w-8">
            {index + 1}.
          </span>
          <input
            type="text"
            value={option.text}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="flex-1 border border-zinc-200 outline-none p-3 rounded-md text-sm focus:shadow-sm"
          />
          {options.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveOption(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddOption}
        className="flex items-center gap-2 text-violet-600 p-2 border border-dashed border-violet-300 rounded-md hover:bg-violet-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">Add Option</span>
      </button>
    </div>
  );
};

export default AnswerOptions;