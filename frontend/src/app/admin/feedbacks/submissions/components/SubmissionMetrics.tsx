import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart2,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { AIInsightsCard } from './AIInsightsCard';
import { getCookie } from 'cookies-next';

interface User {
  id: number;
  fullname: string;
  username: string;
  email: string;
  gender: string;
  avatar: string;
  roles: string[];
}

interface SubmissionMetricsProps {
  totalSubmissions: number;
  analyzedCount: number;
  totalProjects: number;
  totalUsers: number;
  feedbackId: number;
  recentSubmissions: number;
  submittedBy?: string | null;
}

// Add new component for animated background
const AnimatedBackground = () => (
  <>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-blue-600/20" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
  </>
);

const MetricBox = ({ icon: Icon, title, value, description, color = "blue", confidence }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  description?: string;
  color?: "blue" | "violet" | "emerald";
  confidence?: number;
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 ring-1 ring-white/20 hover:ring-white/30 transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className={cn(
        "p-2 rounded-lg",
        color === "blue" ? "bg-blue-400/20" : 
        color === "violet" ? "bg-violet-400/20" : 
        "bg-emerald-400/20"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    {description && (
      <p className="mt-1 text-sm text-white/60">{description}</p>
    )}
    {confidence && (
      <p className="mt-1 text-sm text-white/60">Confidence: {confidence.toFixed(1)}%</p>
    )}
  </div>
);

export function SubmissionMetrics({
  totalSubmissions,
  analyzedCount,
  totalProjects,
  totalUsers,
  feedbackId,
  recentSubmissions,
  submittedBy
}: SubmissionMetricsProps) {
  const [aiInsights, setAiInsights] = useState<any | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getCookie('accessToken');
        const [insightsRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:8085/api/analysis/insights/${feedbackId}`),
          submittedBy ? axios.get<User[]>('http://localhost:8081/api/manager/list', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }) : Promise.resolve({ data: [] })
        ]);

        setAiInsights(insightsRes.data);

        if (submittedBy && usersRes.data) {
          const user = usersRes.data.find(u => u.id === parseInt(submittedBy));
          if (user) {
            setUserData(user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (feedbackId) {
      fetchData();
    }
  }, [feedbackId, submittedBy]);

  return (
    <div className="space-y-8">
      {/* AI Insights Card */}
      {aiInsights && <AIInsightsCard insights={aiInsights} />}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <BarChart2 className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
                <span className="text-sm text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Analysis Status</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{analyzedCount}/{totalSubmissions}</p>
                <span className="text-sm text-gray-600">
                  {((analyzedCount / totalSubmissions) * 100).toFixed(1)}% analyzed • {recentSubmissions} today
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  +8%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Submission By</p>
              <div className="flex items-center gap-2">
                {userData ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={userData.avatar} 
                      alt={userData.fullname}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userData.fullname}</p>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                ) : submittedBy ? (
                  <p className="text-sm text-gray-500">User not found</p>
                ) : (
                  <p className="text-sm text-gray-500">Anonymous</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 