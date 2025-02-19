
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreateFeedbackDialog } from "@/components/feedback/CreateFeedbackDialog";
import {
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  MessageSquare,
  Heart,
  Smile,
  Trash2,
  Plus,
  Edit,
} from "lucide-react";
import { Project, Question, Feedback } from "@/types/feedback";

const feedbacks = [
  {
    id: 1,
    title: "Product Feedback",
    description: "User feedback on the new feature release",
    sentiment: "positive",
    responses: 45,
    category: "Product",
    date: "2024-02-07",
    status: "active",
  },
  {
    id: 2,
    title: "Service Experience",
    description: "Customer service satisfaction survey",
    sentiment: "neutral",
    responses: 32,
    category: "Service",
    date: "2024-02-06",
    status: "completed",
  },
  // Add more sample feedbacks as needed
];

const FeedbackManage = () => {
  // Add state for dialog control and form data
  const [open, setOpen] = useState(false);
  const [projects] = useState<Project[]>([
    { id: 1, name: "Project A", members: [{ id: 1, name: "John Doe" }] },
    { id: 2, name: "Project B", members: [{ id: 2, name: "Jane Smith" }] },
  ]);
  const [questions] = useState<Question[]>([
    { id: 1, text: "How satisfied are you?", type: "RATING" },
    { id: 2, text: "Any suggestions?", type: "TEXT" },
  ]);
  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({
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
    // Handle feedback creation logic here
    console.log("Creating feedback:", newFeedback);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white/90">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Feedback Forms
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Create and manage feedback forms to gather insights from your users
            </p>
          </div>
          <CreateFeedbackDialog
            open={open}
            onOpenChange={setOpen}
            projects={projects}
            questions={questions}
            newFeedback={newFeedback}
            setNewFeedback={setNewFeedback}
            onCreateFeedback={handleCreateFeedback}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Responses
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">1,234</div>
                <div className="text-sm text-green-600 font-medium">+12.3%</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Across all feedback forms
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Rating
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">4.5</div>
                <div className="text-sm text-green-600 font-medium">+0.2</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Out of 5 stars average
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Positive Sentiment
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Smile className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-green-600 font-medium">+5%</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                From all responses
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="relative overflow-hidden border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
          <CardHeader className="space-y-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Feedback Forms</CardTitle>
                <CardDescription>
                  Manage and monitor your feedback collection forms
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search forms..."
                    className="pl-9 pr-4 w-[300px] bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-100 overflow-hidden bg-white/50 backdrop-blur-sm">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>Title & Description</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="group hover:bg-gray-50/50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{feedback.title}</div>
                          <div className="text-sm text-gray-500">
                            {feedback.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            ${
                              feedback.sentiment === 'positive'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : feedback.sentiment === 'neutral'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-red-100 text-red-700 border-red-200'
                            }
                            inline-flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-sm
                          `}
                        >
                          <Smile className="h-4 w-4" />
                          <span className="capitalize">{feedback.sentiment}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{feedback.responses}</div>
                        <div className="text-xs text-gray-500">Total responses</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white">
                          {feedback.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            feedback.status === "active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        >
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{feedback.date}</div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              View Responses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Form
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <Trash2 className="h-4 w-4" />
                              Delete Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackManage;
