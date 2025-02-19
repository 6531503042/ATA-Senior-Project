import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MessageSquare, Star, ListChecks, HandHeart, MessageCircle, Megaphone } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { Project, Question, Feedback } from "@/types/feedback";
import { Dispatch, SetStateAction } from "react";

const feedbackTypes = [
  {
    id: "satisfaction",
    name: "Satisfaction Survey",
    description: "Measure user satisfaction and happiness",
    icon: HandHeart,
    gradient: "from-rose-50 to-pink-50",
    iconColor: "text-rose-600",
    borderHover: "hover:border-rose-200",
  },
  {
    id: "feature",
    name: "Feature Feedback",
    description: "Gather feedback on specific features",
    icon: Megaphone,
    gradient: "from-blue-50 to-sky-50",
    iconColor: "text-blue-600",
    borderHover: "hover:border-blue-200",
  },
  {
    id: "general",
    name: "General Feedback",
    description: "Collect open-ended user feedback",
    icon: MessageCircle,
    gradient: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600",
    borderHover: "hover:border-violet-200",
  },
];

const categories = [
  "Product",
  "Service",
  "User Experience",
  "Customer Support",
  "Performance",
  "Other",
];

interface CreateFeedbackDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  projects: Project[];
  questions: Question[];
  newFeedback: Partial<Feedback>;
  setNewFeedback: Dispatch<SetStateAction<Partial<Feedback>>>;
  onCreateFeedback: () => void;
}

export const CreateFeedbackDialog: React.FC<CreateFeedbackDialogProps> = ({
  open,
  onOpenChange,
  projects,
  questions,
  newFeedback,
  setNewFeedback,
  onCreateFeedback,
}) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  // Sample questions - in a real app, these would come from your backend

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="h-5 w-5" />
          Create Feedback Form
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            <MessageSquare className="h-6 w-6 text-violet-600" />
            Create Feedback Form
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Design a feedback form to gather valuable user insights
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Feedback Type Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-700">Choose Feedback Type</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType(type.id)}
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all duration-300",
                    feedbackType === type.id
                      ? "border-primary ring-2 ring-primary/20 shadow-lg"
                      : `border-transparent ${type.borderHover} hover:shadow-md`
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r rounded-xl opacity-50",
                      type.gradient
                    )}
                  />
                  <div className="relative space-y-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center",
                        type.iconColor
                      )}
                    >
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2 text-left">
                      <h3 className="font-semibold text-gray-800">{type.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Form Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Product Satisfaction Survey"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Category</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide context about this feedback form"
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Start Date</Label>
                <DatePicker />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">End Date</Label>
                <DatePicker />
              </div>
            </div>

            {/* Question Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700">Select Questions</Label>
              <div className="space-y-3">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all cursor-pointer",
                      selectedQuestions.includes(question.id)
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-violet-200 hover:bg-gray-50"
                    )}
                    onClick={() => handleQuestionToggle(question.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={cn(
                          "h-6 w-6 rounded flex items-center justify-center",
                          selectedQuestions.includes(question.id)
                            ? "bg-violet-500 text-white"
                            : "bg-gray-100"
                        )}>
                          {selectedQuestions.includes(question.id) && (
                            <Plus className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-800">{question.text}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {question.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-6"
            onClick={() => onCreateFeedback()}
          >
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
