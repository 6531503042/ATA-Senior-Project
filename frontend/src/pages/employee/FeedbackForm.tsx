import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  text: string;
  content: string;
  type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "SINGLE_CHOICE";
  required: boolean;
  answers?: { text: string; value: string }[];
}

const FeedbackForm = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [privacyLevel, setPrivacyLevel] = useState("anonymous");
  
  const questions: Question[] = [
    {
      id: 1,
      text: "Work Environment Satisfaction",
      content: "How satisfied are you with the work environment?",
      type: "RATING",
      required: true,
      answers: [
        { text: "Positive", value: "3" },
        { text: "Neutral", value: "2" },
        { text: "Negative", value: "1" },
      ],
    },
    {
      id: 2,
      text: "Additional Comments",
      content: "Please provide any additional comments or suggestions.",
      type: "TEXT",
      required: false,
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been submitted successfully.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-ata-gray">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-ata-blue">Employee Satisfaction Survey 2024</h1>
              <p className="text-ata-text mt-2">Share your thoughts about your work experience</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-3 text-ata-text mb-4">
                  <Shield className="h-5 w-5" />
                  <h3 className="font-medium">Privacy Settings</h3>
                </div>
                <Select value={privacyLevel} onValueChange={setPrivacyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select privacy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="confidential">Confidential (HR Only)</SelectItem>
                    <SelectItem value="team">Visible to Team</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-ata-text mt-2">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Your privacy selection will determine who can see your feedback responses.
                </p>
              </Card>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question) => (
                  <Card key={question.id} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{question.text}</h3>
                        <p className="text-sm text-ata-text mb-4">{question.content}</p>
                        {question.required && (
                          <span className="text-xs text-red-500">* Required</span>
                        )}
                      </div>

                      {question.type === "RATING" && question.answers && (
                        <RadioGroup defaultValue="neutral">
                          {question.answers.map((answer) => (
                            <div key={answer.value} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={answer.value}
                                id={`${question.id}-${answer.value}`}
                              />
                              <Label htmlFor={`${question.id}-${answer.value}`}>
                                {answer.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {question.type === "TEXT" && (
                        <Textarea
                          placeholder="Enter your response"
                          className="min-h-[100px]"
                        />
                      )}
                    </div>
                  </Card>
                ))}

                <div className="flex justify-between pt-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button type="submit">Submit Feedback</Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FeedbackForm;