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
  Users,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Star,
  AlertCircle,
} from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                <h3 className="text-2xl font-bold">490</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Positive Rate</p>
                <h3 className="text-2xl font-bold">78%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <h3 className="text-2xl font-bold">4.5</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Response Rate</p>
                <h3 className="text-2xl font-bold">92%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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