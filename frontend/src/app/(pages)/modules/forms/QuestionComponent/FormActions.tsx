import { Rocket } from "lucide-react";
import React from "react";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, onSubmit }) => {
  return (
    <div className="w-full flex flex-row justify-end gap-3">
      <button
        type="button"
        className="border border-zinc-300 py-2 px-3 text-sm rounded-md hover:shadow-lg hover:shadow-zinc-200 transition-all"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        className="border border-transparent bg-violet-600 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-violet-200 transition-all"
        onClick={onSubmit}
      >
        <Rocket className="h-4 w-4" />
        <p>Create Question</p>
      </button>
    </div>
  );
};

export default FormActions;