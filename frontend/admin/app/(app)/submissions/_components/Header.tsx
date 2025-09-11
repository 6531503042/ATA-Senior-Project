'use client';

import { Button, Chip, Card, CardBody, Badge } from '@heroui/react';
import { ArrowLeft, BarChart3, TrendingUp, Users, MessageSquare, Download, Share2 } from 'lucide-react';

type Props = {
  title: string;
  total: number;
  onBack?: () => void;
};

export default function Header({ title, total, onBack }: Props) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 overflow-hidden">
      <CardBody className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <Button
              size="sm"
              startContent={<ArrowLeft className="w-4 h-4" />}
              variant="bordered"
              onPress={onBack}
              className="flex-shrink-0 hover:bg-default-100 transition-colors duration-200"
            >
              Back to Selection
            </Button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-default-900 truncate">
                    {title}
                  </h1>
                  <p className="text-default-600 text-sm">
                    Feedback analysis dashboard with detailed insights
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-default-500" />
                  <span className="text-sm text-default-600">
                    <strong className="text-default-900">{total}</strong> responses
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-default-500" />
                  <span className="text-sm text-default-600">
                    <strong className="text-green-600">Active</strong> analysis
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-default-500" />
                  <span className="text-sm text-default-600">
                    Real-time insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Submission Count Badge */}
            <Badge content={total} color="primary" size="lg" placement="top-right">
              <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary-700" />
              </div>
            </Badge>

            {/* Status Chip */}
            <Chip 
              color="success" 
              size="md" 
              variant="flat"
              startContent={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              className="font-medium"
            >
              {total} Submissions
            </Chip>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<Download className="w-4 h-4" />}
                className="bg-secondary-50 hover:bg-secondary-100"
              >
                Export
              </Button>
              
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<Share2 className="w-4 h-4" />}
                className="bg-primary-50 hover:bg-primary-100"
              >
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-6 pt-4 border-t border-default-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
              icon={<Users className="w-4 h-4" />}
              label="Total Responses"
              value={total.toString()}
              color="text-blue-600"
            />
            
            <StatItem
              icon={<TrendingUp className="w-4 h-4" />}
              label="Completion Rate"
              value="94%"
              color="text-green-600"
            />
            
            <StatItem
              icon={<BarChart3 className="w-4 h-4" />}
              label="Avg. Rating"
              value="4.2/5"
              color="text-purple-600"
            />
            
            <StatItem
              icon={<MessageSquare className="w-4 h-4" />}
              label="Response Time"
              value="2.5 min"
              color="text-orange-600"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function StatItem({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-white to-default-50/50 rounded-lg border border-default-200 hover:shadow-sm transition-shadow duration-200">
      <div className={`${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-default-500 font-medium">{label}</p>
        <p className={`text-sm font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
