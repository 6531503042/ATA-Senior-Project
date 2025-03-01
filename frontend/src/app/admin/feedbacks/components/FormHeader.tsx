'use client';

import React from 'react';
import { ClipboardList, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FormHeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ setIsOpen }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-100 rounded-lg">
          <ClipboardList className="h-6 w-6 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create Feedback Form</h2>
          <p className="mt-1 text-sm text-gray-500">
            Design a feedback form to gather valuable insights from your team
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setIsOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FormHeader; 