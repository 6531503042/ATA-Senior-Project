import React from 'react';
import DatePicker from './DatePicker';

interface FormBodyProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
}

const FormBody: React.FC<FormBodyProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
}) => {
  return (
    <>
      <div className="w-full flex flex-row gap-5">
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-zinc-700">Form Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Product Satisfaction Survey"
            className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
            required
          />
        </div>
      </div>

      <div className="w-full flex flex-col">
        <h3 className="text-sm font-medium text-zinc-700">Description</h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project goals and objectives"
          className="w-full border border-zinc-200 outline-none p-3 rounded-md mt-2 text-sm focus:shadow-sm"
        />
      </div>

      <div className="w-full flex flex-row gap-5 text-zinc-700">
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label="Start Date"
        />
        <DatePicker
          date={dueDate}
          setDate={setDueDate}
          label="Due Date"
          startDate={startDate}
        />
      </div>
    </>
  );
};

export default FormBody;