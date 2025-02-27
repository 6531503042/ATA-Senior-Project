import SelectWithIcon from "@/components/shared/SelectWithIcon";
import { CheckSquare, ListChecks, MessageSquare, Star } from "lucide-react";
import React from "react";

interface QuestionTypeSelectProps {
  selectedType: string;
  onChange: (value: string) => void;
}

const QuestionTypeSelect: React.FC<QuestionTypeSelectProps> = ({
  selectedType,
  onChange,
}) => {
  const questionTypeOptions = [
    { value: "SINGLE_CHOICE", label: "Single Choice", icon: CheckSquare },
    { value: "MULTIPLE_CHOICE", label: "Multiple Choice", icon: ListChecks },
    { value: "SENTIMENT", label: "Sentiment", icon: Star },
    { value: "TEXT_BASED", label: "Text", icon: MessageSquare },
  ];

  return (
    <div className="flex w-full flex-col">
      <h3 className="text-sm font-medium mb-2">Question Type</h3>
      <div className="">
        <SelectWithIcon
          options={questionTypeOptions}
          value={selectedType}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default QuestionTypeSelect;