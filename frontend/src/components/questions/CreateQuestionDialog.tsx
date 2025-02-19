
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { SmilePlus, Frown, Meh, Plus, Minus, Text, List, Radio, CheckSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Question } from "@/types/question";
import { cn } from "@/lib/utils";

interface Answer {
  text: string;
  value: string;
  icon?: React.ReactNode;
}

const defaultSentimentAnswers: Answer[] = [
  { text: "Positive", value: "3", icon: <SmilePlus className="h-5 w-5 text-green-500" /> },
  { text: "Neutral", value: "2", icon: <Meh className="h-5 w-5 text-yellow-500" /> },
  { text: "Negative", value: "1", icon: <Frown className="h-5 w-5 text-red-500" /> },
];

const questionTypeIcons = {
  RATING: <SmilePlus className="h-5 w-5" />,
  TEXT: <Text className="h-5 w-5" />,
  MULTIPLE_CHOICE: <CheckSquare className="h-5 w-5" />,
  SINGLE_CHOICE: <Radio className="h-5 w-5" />,
};

export function CreateQuestionDialog() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: "",
    content: "",
    type: "RATING",
    required: true,
    category: "WORK_ENVIRONMENT",
    answerType: "SATISFACTION_BASE",
    answers: [],
  });

  const handleCreateQuestion = () => {
    if (!newQuestion.text) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Question created successfully",
    });
    
    setIsOpen(false);
    setNewQuestion({
      text: "",
      content: "",
      type: "RATING",
      required: true,
      category: "WORK_ENVIRONMENT",
      answerType: "SATISFACTION_BASE",
      answers: [],
    });
  };

  const handleAddAnswer = () => {
    setNewQuestion(prev => ({
      ...prev,
      answers: [...(prev.answers || []), { text: "", value: String(prev.answers?.length || 0) }]
    }));
  };

  const handleAnswerChange = (index: number, field: keyof Answer, value: string) => {
    setNewQuestion(prev => {
      const newAnswers = [...(prev.answers || [])];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      return { ...prev, answers: newAnswers };
    });
  };

  const handleRemoveAnswer = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      answers: prev.answers?.filter((_, i) => i !== index) || []
    }));
  };

  const renderAnswerFields = () => {
    if (newQuestion.type === "TEXT") {
      return (
        <div className="p-4 rounded-xl border bg-gray-50">
          <div className="flex items-center gap-3 text-gray-600">
            <Text className="h-5 w-5" />
            <p className="text-sm">Text response will be collected from users</p>
          </div>
        </div>
      );
    }

    if (newQuestion.type === "RATING") {
      return (
        <div className="space-y-4">
          <Label>Sentiment Options</Label>
          <div className="grid grid-cols-3 gap-4">
            {defaultSentimentAnswers.map((answer, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border bg-gradient-to-b from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {answer.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{answer.text}</p>
                    <p className="text-xs text-gray-500">Value: {answer.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Answer Options</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAnswer}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {newQuestion.answers?.map((answer, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="flex-1 relative">
                <Input
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAnswer(index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {newQuestion.answers?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Add options for users to choose from
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          New Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a new question for feedback collection
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label>Question Type</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(value: Question['type']) => 
                  setNewQuestion({ ...newQuestion, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(questionTypeIcons).map(([type, icon]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {icon}
                        <span>{type.replace(/_/g, " ").toLowerCase()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Question Text</Label>
              <Input
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, text: e.target.value })
                }
                placeholder="Enter your question"
                className="bg-white"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
                placeholder="Add additional context"
                className="bg-white resize-none"
              />
            </div>

            {renderAnswerFields()}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateQuestion}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            Create Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
