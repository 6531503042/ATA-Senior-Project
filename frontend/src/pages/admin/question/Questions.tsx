
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateQuestionDialog } from "@/components/questions/CreateQuestionDialog";
import { BookOpen, Search, SlidersHorizontal, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Question } from "@/types/question";
import { cn } from "@/lib/utils";

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white/90">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Create and manage questions for your feedback forms.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateQuestionDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600">Total Questions</h3>
                  <div className="text-2xl font-bold">{questions.length}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search questions..."
              className="pl-10 pr-4 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <Card key={question.id} className="group hover:shadow-lg transition-all">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2">{question.text}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{question.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                    {question.type}
                  </span>
                  {question.required && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Required
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
