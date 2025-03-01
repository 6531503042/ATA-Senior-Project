"use client";

import { useState } from "react";
import { ChevronDown, Download, TrendingUp } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

const overallSatisfaction = 74;
const sentimentData = {
  positive: 80,
  neutral: 8.3,
  negative: 5.7,
};
const projects = ["All", "Project A", "Project B", "Project C"];

const getEmoji = (value: number) => {
  if (value > 66) return "😊";
  if (value >= 34) return "😐";
  return "😞";
};

const chartData = [
  { name: "Satisfaction", value: overallSatisfaction, fill: "hsl(var(--chart-1))" },
];

export function SatisfactionOverview() {
  const [selectedProject, setSelectedProject] = useState("All");

  return (
    <Card className="p-6 space-y-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-purple-600">
            Satisfaction Overview
          </CardTitle>
          <CardDescription>
            Year-over-year satisfaction analysis and sentiment distribution
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Project: {selectedProject} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded-lg shadow-md">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => setSelectedProject(project)}
                >
                  {project}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary">
            Export <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-row justify-between items-center gap-6">
        {/* 📌 Radial Chart Minimal */}
        <div className="relative flex flex-col items-center w-1/2">
          <p className="text-muted-foreground font-medium mb-2">
            Overall Satisfaction
          </p>

          <div className="relative">
            <RadialBarChart
              width={250}
              height={250}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              barSize={16} 
              data={chartData}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />

              <RadialBar dataKey="value" fill="#E0E0E0" background={{ fill: "#E0E0E0" }}  cornerRadius={10}  />
            </RadialBarChart>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl">{getEmoji(overallSatisfaction)}</span>
              <p className="text-4xl font-bold text-purple-600">
                {overallSatisfaction}%
              </p>
              <p className="text-muted-foreground text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-4 text-center w-1/2">
          <div className="p-4 rounded-lg shadow-md bg-white">
            <div className="text-4xl">😊</div>
            <p className="text-green-600 font-bold">{sentimentData.positive}%</p>
            <p className="text-muted-foreground">Positive</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-white">
            <div className="text-4xl">😐</div>
            <p className="text-yellow-600 font-bold">{sentimentData.neutral}%</p>
            <p className="text-muted-foreground">Neutral</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-white">
            <div className="text-4xl">😞</div>
            <p className="text-red-600 font-bold">{sentimentData.negative}%</p>
            <p className="text-muted-foreground">Negative</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span className="text-green-600">▲ 4.2%</span> Year-over-Year Change
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <div className="leading-none text-muted-foreground">Previous Year: 70%</div>
      </CardFooter>
    </Card>
  );
}
