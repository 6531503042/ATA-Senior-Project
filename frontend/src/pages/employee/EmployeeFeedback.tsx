import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeedbackItem {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  projectName: string;
}

const EmployeeFeedback = () => {
  const navigate = useNavigate();
  
  const pendingFeedbacks: FeedbackItem[] = [
    {
      id: 1,
      name: "Employee Satisfaction Survey 2024",
      description: "Share your thoughts about your work experience",
      dueDate: "2024-02-28",
      status: "pending",
      projectName: "Company Culture Initiative",
    },
  ];

  const completedFeedbacks: FeedbackItem[] = [
    {
      id: 2,
      name: "Q4 2023 Project Review",
      description: "Project feedback and improvement suggestions",
      dueDate: "2023-12-15",
      status: "completed",
      projectName: "Digital Transformation",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-ata-gray">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-ata-blue">My Feedback</h1>
              <p className="text-ata-text mt-2">View and complete your feedback requests</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Pending Feedback
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingFeedbacks.map((feedback) => (
                    <Card key={feedback.id} className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-ata-blue">{feedback.name}</h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-ata-text">{feedback.description}</p>
                        </div>
                        
                        <div className="text-sm text-ata-text">
                          <p className="mb-1">Project: {feedback.projectName}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(feedback.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => navigate(`/employee/feedback/${feedback.id}`)}
                        >
                          Start Feedback
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completed Feedback
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedFeedbacks.map((feedback) => (
                    <Card key={feedback.id} className="p-6 opacity-75">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-ata-blue">{feedback.name}</h3>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Completed
                            </span>
                          </div>
                          <p className="text-sm text-ata-text">{feedback.description}</p>
                        </div>
                        
                        <div className="text-sm text-ata-text">
                          <p className="mb-1">Project: {feedback.projectName}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Completed: {new Date(feedback.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/employee/feedback/${feedback.id}`)}
                        >
                          View Feedback
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeFeedback;