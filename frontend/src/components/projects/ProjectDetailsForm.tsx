
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

export function ProjectDetailsForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Name</Label>
        <Input
          id="title"
          placeholder="e.g., Website Redesign"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the project goals and objectives"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <DatePicker />
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DatePicker />
        </div>
      </div>
    </div>
  );
}
