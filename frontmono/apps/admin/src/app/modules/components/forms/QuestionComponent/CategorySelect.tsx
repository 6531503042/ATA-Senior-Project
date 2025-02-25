import SelectWithIcon from "@/app/modules/components/SelectWithIcon";
import {
  MessageCircleQuestion,
  Briefcase,
  Heart,
  Users,
  ClipboardList,
  ThumbsUp,
  Code,
  MessageSquare,
  Target,
  Lightbulb,
  GraduationCap
} from "lucide-react";
import React from "react";

interface CategorySelectProps {
  selectedCategory: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onChange,
}) => {
  const categoryOptions = [
    { value: "GENERAL", label: "General", icon: MessageCircleQuestion },
    { value: "WORK_ENVIRONMENT", label: "Work Environment", icon: Briefcase },
    { value: "WORK_LIFE_BALANCE", label: "Work Life Balance", icon: Heart },
    { value: "TEAM_COLLABORATION", label: "Team Collaboration", icon: Users },
    { value: "PROJECT_MANAGEMENT", label: "Project Management", icon: ClipboardList },
    { value: "PROJECT_SATISFACTION", label: "Project Satisfaction", icon: ThumbsUp },
    { value: "TECHNICAL_SKILLS", label: "Technical Skills", icon: Code },
    { value: "COMMUNICATION", label: "Communication", icon: MessageSquare },
    { value: "LEADERSHIP", label: "Leadership", icon: Target },
    { value: "INNOVATION", label: "Innovation", icon: Lightbulb },
    { value: "PERSONAL_GROWTH", label: "Personal Growth", icon: GraduationCap },
  ];

  return (
    <div className="flex w-full flex-col overflow-y-auto">
      <h3 className="text-sm font-medium mb-2">Category</h3>
      <div className="">
        <SelectWithIcon
          options={categoryOptions}
          value={selectedCategory}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CategorySelect;