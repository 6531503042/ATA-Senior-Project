
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, BarChart, ArrowRight, Users } from "lucide-react";
import { Project, Question, Feedback } from "@/types/feedback";

interface FeedbackCardProps {
  feedback: Feedback;
  getProjectName: (projectId: number) => string;
  getSelectedQuestions: (questionIds: number[]) => Question[];
  projects: Project[];
}

export const FeedbackCard = ({
  feedback,
  getProjectName,
  getSelectedQuestions,
  projects,
}: FeedbackCardProps) => {
  return (
    <Card key={feedback.id} className="p-6 space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{feedback.name}</h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              feedback.status === "active"
                ? "bg-green-100 text-green-800"
                : feedback.status === "completed"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{feedback.description}</p>
        <p className="text-sm font-medium mt-2">
          Project: {getProjectName(feedback.projectId)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            {new Date(feedback.feedbackStartDate).toLocaleDateString()} -{" "}
            {new Date(feedback.feedbackEndDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{getSelectedQuestions(feedback.questionIds).length} questions</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {projects.find((p) => p.id === feedback.projectId)?.members.length}{" "}
              members
            </span>
          </div>
          <div className="flex items-center text-sm">
            <BarChart className="mr-2 h-4 w-4" />
            <span>{feedback.responseCount} responses</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button variant="ghost" size="sm">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
