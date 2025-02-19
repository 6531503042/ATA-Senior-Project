import React from "react";
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
import {
  PlusCircleIcon,
  EllipsisHorizontalIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CreateQuestionDialog } from "@/components/questions/CreateQuestionDialog";

// Import specific emotion icons
import { FaceSmileIcon as HappyIcon } from "@heroicons/react/24/solid";
import { FaceFrownIcon as SadIcon } from "@heroicons/react/24/solid";
import { NoSymbolIcon as NeutralIcon } from "@heroicons/react/24/solid";

const typeColors = {
  text: "bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border-blue-200",
  multiple_choice: "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200",
  sentiment: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200",
};

const typeIcons = {
  text: DocumentTextIcon,
  multiple_choice: ClipboardDocumentCheckIcon,
  sentiment: ChatBubbleBottomCenterTextIcon,
};

const questions = [
  {
    id: 1,
    title: "Overall Satisfaction",
    description: "Rate your overall satisfaction with our service",
    type: "sentiment",
    responses: 156,
    category: "Service",
    lastModified: "2024-02-07",
    status: "active",
    sentiment: { positive: 65, neutral: 25, negative: 10 },
  },
  {
    id: 2,
    title: "Feature Preferences",
    description: "Which features do you use most frequently?",
    type: "multiple_choice",
    responses: 89,
    category: "Product",
    lastModified: "2024-02-06",
    status: "active",
    options: ["Dashboard", "Reports", "Analytics", "Settings"],
  },
  // Add more sample questions as needed
];

const QuestionManage = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Question Management</h1>
            <p className="text-gray-500 max-w-2xl">
              Design and manage questions to gather meaningful feedback from your users.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </Button>
            <CreateQuestionDialog />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Questions
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">45</div>
                <div className="text-sm text-green-600 font-medium">+8</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Active questions
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Responses
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">2,345</div>
                <div className="text-sm text-green-600 font-medium">+123</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                This week
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Response Rate
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <ChartBarIcon className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">78%</div>
                <div className="text-sm text-green-600 font-medium">+5%</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Average completion
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sentiment Score
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                <HappyIcon className="h-4 w-4 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-3xl font-bold">4.2</div>
                <div className="text-sm text-green-600 font-medium">+0.3</div>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Out of 5 points
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
          <CardHeader className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Manage and monitor your feedback questions
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <FunnelIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>Question Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => {
                    const TypeIcon = typeIcons[question.type as keyof typeof typeIcons];
                    return (
                      <TableRow key={question.id} className="group hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{question.title}</div>
                            <div className="text-sm text-gray-500">
                              {question.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              typeColors[question.type as keyof typeof typeColors]
                            } inline-flex items-center gap-1 px-2.5 py-1 rounded-full border shadow-sm`}
                          >
                            <TypeIcon className="h-4 w-4" />
                            <span className="capitalize">
                              {question.type.replace("_", " ")}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{question.responses}</div>
                          <div className="text-xs text-gray-500">Total responses</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-white">
                            {question.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              question.status === "active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }
                          >
                            {question.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">{question.lastModified}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <EllipsisHorizontalIcon className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <ChartBarIcon className="h-4 w-4" />
                                View Responses
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <PencilSquareIcon className="h-4 w-4" />
                                Edit Question
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <TrashIcon className="h-4 w-4" />
                                Delete Question
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionManage;
