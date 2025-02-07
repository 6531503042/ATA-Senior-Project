import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import {
  Star,
} from 'lucide-react';
import CardPreview from "@/app/components/old/card/card_preview_admin"

const Dashboard = () => {
  // Mock data - replace with real data
  const monthlyFeedback = [
    { month: 'Jan', count: 65, positive: 45, negative: 20 },
    { month: 'Feb', count: 75, positive: 55, negative: 20 },
    { month: 'Mar', count: 85, positive: 65, negative: 20 },
    { month: 'Apr', count: 95, positive: 70, negative: 25 },
    { month: 'May', count: 80, positive: 60, negative: 20 },
    { month: 'Jun', count: 90, positive: 75, negative: 15 },
  ];

  const recentFeedback = [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Excellent service and support from the team!",
      date: "2025-01-10",
      category: "Support"
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Good experience overall, but response time could be better",
      date: "2025-01-09",
      category: "Response Time"
    },
    // Add more feedback items as needed
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feedback Dashboard</h1>
        <div className="flex gap-2">
          <select className="px-4 py-2 border rounded-md bg-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <CardPreview/>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFeedback}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="positive" stroke="#10B981" />
                  <Line type="monotone" dataKey="negative" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFeedback}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Comment</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFeedback.map((feedback) => (
                  <tr key={feedback.id} className="border-b">
                    <td className="px-4 py-3">{feedback.user}</td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {Array.from({ length: feedback.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{feedback.comment}</td>
                    <td className="px-4 py-3">{feedback.category}</td>
                    <td className="px-4 py-3">{feedback.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;