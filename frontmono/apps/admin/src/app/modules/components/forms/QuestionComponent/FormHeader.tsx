import { MessageCircleQuestion, X } from "lucide-react";
import React from "react";

interface FormHeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ setIsOpen }) => {
  return (
    <div className="flex flex-row">
      <div className="w-full flex flex-col gap-1 mt-2">
        <div className="flex flex-row gap-2 items-center">
          <MessageCircleQuestion className="h-6 w-6 text-violet-500" />
          <h1 className="text-2xl font-semibold">Create New Question</h1>
        </div>
        <p className="text-zinc-400 text-sm font-normal">
          Add a new question for feedback collection
        </p>
      </div>
      <button
        className="flex-1 flex justify-end"
        onClick={() => setIsOpen(false)}
      >
        <X className="text-slate-600 h-4 w-4 hover:text-slate-900" />
      </button>
    </div>
  );
};

export default FormHeader;