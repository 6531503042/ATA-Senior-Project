"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"; // Next UI Table components
import { Badge } from "@nextui-org/react"; // Next UI Badge component

const FeedbackTable = () => {
  const feedbackData = [
    {
      priority: "High",
      team: "Development",
      project: "Project A",
      feedback: "Great work environment",
      category: "Environment",
      status: "Reviewed",
    },
    {
      priority: "Medium",
      team: "Marketing",
      project: "Project B",
      feedback: "Need better communication",
      category: "Management",
      status: "Pending",
    },
    {
      priority: "Low",
      team: "HR",
      project: "Project C",
      feedback: "Positive team collaboration",
      category: "Environment",
      status: "Reviewed",
    },
    // Add more mock data
  ];

  // Helper function to determine the badge color
  const getBadgeColor = (priority: string) => {
    if (priority === "High") return "danger"; // red
    if (priority === "Medium") return "warning"; // yellow
    return "success"; // green
  };

  return (
    <Table aria-label="Feedback Table" className="bg-white shadow-md rounded-lg overflow-hidden">
      <TableHeader>
        <TableColumn>Priority</TableColumn>
        <TableColumn>Team</TableColumn>
        <TableColumn>Project</TableColumn>
        <TableColumn>Feedback</TableColumn>
        <TableColumn>Category</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody>
        {feedbackData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <Badge color={getBadgeColor(item.priority)}>{item.priority}</Badge>
            </TableCell>
            <TableCell>{item.team}</TableCell>
            <TableCell>{item.project}</TableCell>
            <TableCell>{item.feedback}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FeedbackTable;
