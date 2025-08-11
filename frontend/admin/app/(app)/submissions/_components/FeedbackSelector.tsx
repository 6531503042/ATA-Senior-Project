"use client";

import { Select, SelectItem } from "@heroui/react";

type FeedbackOption = { id: string; title: string };

type Props = {
  options: FeedbackOption[];
  value?: string;
  onChange: (id: string) => void;
};

export default function FeedbackSelector({ options, value, onChange }: Props) {
  return (
    <Select
      label="Feedback"
      placeholder="Select feedback"
      selectedKeys={value ? new Set([value]) : new Set()}
      onSelectionChange={(keys) => {
        const [first] = Array.from(keys);
        if (first) onChange(String(first));
      }}
      className="w-full max-w-sm"
      selectionMode="single"
      variant="bordered"
    >
      {options.map((opt) => (
        <SelectItem key={opt.id}>{opt.title}</SelectItem>
      ))}
    </Select>
  );
}


