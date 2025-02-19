import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FeedbackCard } from "@/components/feedback/FeedbackCard";
import { FeedbackHeader } from "@/components/feedback/FeedbackHeader";
import { CreateFeedbackDialog } from "@/components/feedback/CreateFeedbackDialog";
import { Project, Question, Feedback as FeedbackType } from "@/types/feedback";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Feedback = () => {
  const { toast } = useToast();
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Employee Satisfaction 2024",
      members: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ],
    },
  ]);

  const [questions] = useState<Question[]>([
    {
      id: 1,
      text: "How satisfied are you with your work environment?",
      type: "SENTIMENT",
    },
    {
      id: 2,
      text: "What improvements would you suggest?",
      type: "TEXT",
    },
  ]);

  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [isNewFeedbackDialogOpen, setIsNewFeedbackDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState<Partial<FeedbackType>>({
    name: "",
    projectId: 0,
    description: "",
    feedbackStartDate: "",
    feedbackEndDate: "",
    status: "upcoming",
    questionIds: [],
    responseCount: 0,
  });

  const handleCreateFeedback = () => {
    const feedback: FeedbackType = {
      id: feedbacks.length + 1,
      name: newFeedback.name || "",
      projectId: newFeedback.projectId || 0,
      description: newFeedback.description || "",
      feedbackStartDate: newFeedback.feedbackStartDate || "",
      feedbackEndDate: newFeedback.feedbackEndDate || "",
      status: newFeedback.status as "active" | "completed" | "upcoming",
      questionIds: newFeedback.questionIds || [],
      responseCount: 0,
    };

    setFeedbacks([...feedbacks, feedback]);
    setIsNewFeedbackDialogOpen(false);
    setNewFeedback({
      name: "",
      projectId: 0,
      description: "",
      feedbackStartDate: "",
      feedbackEndDate: "",
      status: "upcoming",
      questionIds: [],
      responseCount: 0,
    });

    toast({
      title: "Feedback Created",
      description: "New feedback has been successfully created.",
    });
  };

  const getProjectName = (projectId: number) => {
    return projects.find((p) => p.id === projectId)?.name || "Unknown Project";
  };

  const getSelectedQuestions = (questionIds: number[]) => {
    return questions.filter((q) => questionIds.includes(q.id));
  };

  return (
    <div className="min-h-screen flex w-full bg-ata-gray">
      <div className="flex-1">
        <main className="p-6">
          <div className="flex justify-between items-center">
            <FeedbackHeader />
            <Button onClick={() => setIsNewFeedbackDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Feedback
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                getProjectName={getProjectName}
                getSelectedQuestions={getSelectedQuestions}
                projects={projects}
              />
            ))}
          </div>
          <CreateFeedbackDialog
            open={isNewFeedbackDialogOpen}
            onOpenChange={setIsNewFeedbackDialogOpen}
            projects={projects}
            questions={questions}
            newFeedback={newFeedback}
            setNewFeedback={setNewFeedback}
            onCreateFeedback={handleCreateFeedback}
          />
        </main>
      </div>
    </div>
  );
};

export default Feedback;
