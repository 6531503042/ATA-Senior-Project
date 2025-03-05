import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  ChevronRight, 
  Calendar,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { getCookie } from 'cookies-next';

interface Feedback {
  id: number;
  title: string;
  description: string;
  projectId: number;
  projectName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  submissionCount?: number;
}

interface FeedbackSelectorProps {
  onFeedbackSelect: (feedbackId: number) => void;
  selectedFeedbackId?: number;
}

export function FeedbackSelector({ onFeedbackSelect, selectedFeedbackId }: FeedbackSelectorProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = getCookie('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch feedbacks first
        const response = await axios.get<Feedback[]>('http://localhost:8084/api/v1/admin/feedbacks/get-all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }

        // Initialize with empty submission counts
        const feedbacksWithCounts = response.data.map(feedback => ({
          ...feedback,
          submissionCount: 0
        }));
        
        setFeedbacks(feedbacksWithCounts);
        setIsLoading(false); // Show feedbacks immediately

        // Fetch submission counts in parallel
        const submissionCountPromises = feedbacksWithCounts.map(async (feedback) => {
          try {
            const submissionsResponse = await axios.get(
              `http://localhost:8085/api/analysis/feedback/${feedback.id}`,
              { 
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                timeout: 5000 // Add timeout to prevent hanging
              }
            );
            
            // If we have analysis data, we know it's been analyzed
            return {
              id: feedback.id,
              count: 1 // Since we know it's analyzed
            };
          } catch (error) {
            console.error(`Failed to fetch analysis for feedback ${feedback.id}:`, error);
            return { id: feedback.id, count: 0 };
          }
        });

        // Update counts as they come in
        for (const countPromise of submissionCountPromises) {
          const result = await countPromise;
          setFeedbacks(prevFeedbacks => 
            prevFeedbacks.map(f => 
              f.id === result.id 
                ? { ...f, submissionCount: result.count }
                : f
            )
          );
        }

      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load feedbacks';
        setError(errorMessage);
        setIsLoading(false);
        
        // If token is invalid, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          window.location.href = '/auth/login?error=session_expired';
        }
      }
    };

    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' ? true :
                         filter === 'active' ? feedback.active :
                         !feedback.active;

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
          <p className="text-sm text-gray-500">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-gray-500">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-2">
        {filteredFeedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedFeedbackId === feedback.id
                  ? "border-violet-200 shadow-lg shadow-violet-100/50 bg-violet-50/30"
                  : "hover:border-violet-200 hover:shadow-md"
              )}
              onClick={() => onFeedbackSelect(feedback.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <ClipboardList className="h-4 w-4 text-violet-600" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {feedback.title}
                      </h3>
                      <Badge className={cn(
                        feedback.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-50 text-gray-700"
                      )}>
                        {feedback.active ? (
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                        )}
                        {feedback.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(feedback.startDate), 'MMM d, yyyy')}</span>
                        <ChevronRight className="h-4 w-4" />
                        <span>{format(new Date(feedback.endDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{feedback.submissionCount || 0} Submissions</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Badge className="bg-blue-50 text-blue-700">
                        {feedback.projectName}
                      </Badge>
                    </div>
                  </div>

                  <ChevronRight className={cn(
                    "h-5 w-5 transition-transform",
                    selectedFeedbackId === feedback.id ? "rotate-90" : ""
                  )} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredFeedbacks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No feedbacks found</p>
          </div>
        )}
      </div>
    </div>
  );
} 