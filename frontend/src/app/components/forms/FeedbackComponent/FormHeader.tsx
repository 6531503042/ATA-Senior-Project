import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface FormHeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ setIsOpen }) => {
  return (
    <div className="flex flex-row">
      <div className="w-full flex flex-col gap-1 mt-2">
        <div className="flex flex-row gap-2 items-center">
          <MessageSquare className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-semibold">Create Feedback Form</h1>
        </div>
        <p className="text-zinc-400 text-sm font-normal">
          Design a feedback form to gather valuable user insights
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