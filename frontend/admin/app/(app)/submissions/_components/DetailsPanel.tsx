'use client';

import type { SubmitDto } from '@/types/submission';
import { Card, CardHeader, CardBody, Chip, Divider, Avatar, Button } from '@heroui/react';
import { Calendar, User, Shield, Clock, MessageCircle, FileText, ExternalLink, Save, BarChart3 } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '@/utils/api';

type Props = { 
  item: SubmitDto | null;
  onSentimentSaved?: () => void;
};

export default function DetailsPanel({ item, onSentimentSaved }: Props) {
  // Sentiment analysis state
  const [sentiment, setSentiment] = useState<'positive' | 'neutral' | 'negative' | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing sentiment when item changes
  useEffect(() => {
    if (item && (item as any).adminSentiment) {
      setSentiment((item as any).adminSentiment);
    } else {
      setSentiment('');
    }
  }, [item]);

  // Save sentiment analysis
  const handleSaveAnalysis = useCallback(async () => {
    if (!item || !sentiment) return;
    
    setIsSaving(true);
    try {
      await apiRequest(`/api/submits/${item.id}/analysis`, 'POST', {
        rating: 0, // ส่งค่า default เพื่อให้ backend รับได้
        analysisNotes: `Sentiment: ${sentiment}`,
        sentiment,
        analyzedAt: new Date().toISOString()
      });
      
      // Show success feedback
      console.log('Sentiment analysis saved successfully');
      
      // Refresh data to update status
      if (onSentimentSaved) {
        onSentimentSaved();
      }
    } catch (error) {
      console.error('Failed to save sentiment analysis:', error);
    } finally {
      setIsSaving(false);
    }
  }, [item, sentiment, onSentimentSaved]);
  if (!item) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-default-50/30 overflow-hidden">
        <CardBody className="min-h-[400px] flex items-center justify-center text-center p-8">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-default-100 to-default-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-default-400" />
            </div>
            <h3 className="text-lg font-semibold text-default-600 mb-2">No Submission Selected</h3>
            <p className="text-default-500 text-sm">
              Choose a submission from the list to view detailed information and responses.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'PUBLIC': return 'success';
      case 'PRIVATE': return 'warning';
      case 'ANONYMOUS': return 'secondary';
      case 'CONFIDENTIAL': return 'danger';
      default: return 'default';
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'PUBLIC': return '🌐';
      case 'PRIVATE': return '🔒';
      case 'ANONYMOUS': return '👤';
      case 'CONFIDENTIAL': return '🛡️';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            <Avatar 
              size="sm" 
              name={item.submittedBy ? `User ${item.submittedBy}` : 'Anonymous'} 
              className="bg-gradient-to-br from-primary-400 to-primary-600 text-white"
            />
            <div>
              <h3 className="text-lg font-bold text-default-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Submission #{item.id}
              </h3>
              <p className="text-sm text-default-600">
                Feedback response details and metadata
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-6 p-6">
        {/* Core Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={<User className="w-4 h-4" />}
          label="Submitted By"
            value={item.submittedBy ? `User #${item.submittedBy}` : 'Anonymous User'}
            valueClass={!item.submittedBy ? 'text-default-500 italic' : 'text-default-900 font-medium'}
          />
          
          <InfoCard
            icon={<Calendar className="w-4 h-4" />}
            label="Submission Date"
            value={new Date(item.submittedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            valueClass="text-default-900 font-medium"
          />
        </div>

        {/* Status & Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-default-50 to-default-100/50 rounded-xl border border-default-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-default-600" />
              <span className="text-sm font-medium text-default-600">Privacy Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getPrivacyIcon(item.privacyLevel)}</span>
              <Chip 
                color={getPrivacyColor(item.privacyLevel)} 
                size="sm" 
                variant="flat"
                className="font-medium"
              >
            {item.privacyLevel}
          </Chip>
        </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-default-50 to-default-100/50 rounded-xl border border-default-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-default-600" />
              <span className="text-sm font-medium text-default-600">Analysis Status</span>
            </div>
          <Chip
              color={getStatusColor((item as any).status || 'pending')} 
              size="sm" 
              variant="flat"
              className="font-medium"
            >
              {(item as any).status || 'Pending'}
            </Chip>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-3">
          <InfoRow
            icon={<FileText className="w-4 h-4" />}
            label="Feedback ID"
            value={`#${item.feedbackId}`}
          />
          
          <InfoRow
            icon={<MessageCircle className="w-4 h-4" />}
            label="Feedback Title"
            value={(item as any).feedbackTitle || `Feedback Survey #${item.feedbackId}`}
          />

          {item.overallComments && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Overall Comments</span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                {item.overallComments}
              </p>
            </div>
          )}
        </div>

        <Divider />

        {/* Enhanced Sentiment Analysis Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Advanced Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-purple-400/10 to-pink-400/20"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-700"></div>
          </div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-white mb-1">Sentiment Analysis</h4>
                  <p className="text-white/80 text-sm">Evaluate the emotional tone of this feedback</p>
                </div>
              </div>
            </div>

            {/* Sentiment Selection Grid */}
            <div className="space-y-4 mb-8">
              <div className="text-center">
                <p className="text-white/90 font-semibold text-lg mb-2">Choose Sentiment</p>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    value: 'positive', 
                    emoji: '😊', 
                    label: 'Positive', 
                    colors: 'from-emerald-500 to-green-500',
                    description: 'Favorable response',
                    borderColor: 'border-emerald-400/50'
                  },
                  { 
                    value: 'neutral', 
                    emoji: '😐', 
                    label: 'Neutral', 
                    colors: 'from-amber-500 to-orange-500',
                    description: 'Balanced feedback',
                    borderColor: 'border-amber-400/50'
                  },
                  { 
                    value: 'negative', 
                    emoji: '😞', 
                    label: 'Negative', 
                    colors: 'from-rose-500 to-red-500',
                    description: 'Critical response',
                    borderColor: 'border-rose-400/50'
                  }
                ].map(({ value, emoji, label, colors, description, borderColor }) => (
                  <Button
                    key={value}
                    size="lg"
                    variant="flat"
                    className={sentiment === value 
                      ? `bg-gradient-to-br ${colors} text-white border-2 ${borderColor} shadow-2xl transform scale-105 hover:scale-110 transition-all duration-500` 
                      : `bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300`
                    }
                    onPress={() => setSentiment(value as any)}
                    radius="lg"
                  >
                    <div className="flex flex-col items-center gap-2 py-2">
                      <span className="text-3xl filter drop-shadow-lg">{emoji}</span>
                      <div className="text-center">
                        <p className="font-bold text-base">{label}</p>
                        <p className="text-xs opacity-80">{description}</p>
                      </div>
                      {sentiment === value && (
                        <div className="w-8 h-1 bg-white/50 rounded-full mt-1"></div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                className={sentiment 
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white border-0 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-500' 
                  : 'bg-white/5 backdrop-blur-sm border border-white/20 text-white/50 cursor-not-allowed'
                }
                startContent={<Save className="w-5 h-5" />}
                onPress={handleSaveAnalysis}
                isLoading={isSaving}
                isDisabled={!sentiment}
                radius="lg"
                fullWidth
              >
                <span className="font-bold text-lg">
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Analysis...
                    </span>
                  ) : (
                    'Save Sentiment Analysis'
                  )}
                </span>
              </Button>
              
              {sentiment && (
                <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-white font-medium">
                      Current Selection: <span className="text-cyan-300 font-bold">{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}</span>
                    </p>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {/* Success indicator */}
              {(item as any)?.adminSentiment && (
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                  <div className="flex items-center justify-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium">Analysis completed</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<ExternalLink className="w-4 h-4" />}
            className="bg-primary-50 hover:bg-primary-100"
          >
            View Full Details
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            startContent={<FileText className="w-4 h-4" />}
            className="bg-secondary-50 hover:bg-secondary-100"
          >
            Export Response
          </Button>
        </div>

        {/* Metadata Footer */}
        <div className="pt-4 border-t border-default-200">
          <p className="text-xs text-default-400 text-center">
            Last updated: {new Date(item.submittedAt).toLocaleString()} • ID: {item.id}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

function InfoCard({ 
  icon, 
  label, 
  value, 
  valueClass = 'text-default-900 font-medium' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  valueClass?: string;
}) {
  return (
    <div className="p-4 bg-gradient-to-br from-white to-default-50 rounded-xl border border-default-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-default-600">{label}</span>
      </div>
      <p className={`text-sm ${valueClass}`}>{value}</p>
    </div>
  );
}

function InfoRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-default-50/50 rounded-lg border border-default-200">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-default-600">{label}</span>
      </div>
      <span className="text-sm text-default-900 font-medium">{value}</span>
    </div>
  );
}
