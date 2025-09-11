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
  const [justSaved, setJustSaved] = useState(false);

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
      setJustSaved(true);
      
      // Refresh data to update status
      if (onSentimentSaved) {
        onSentimentSaved();
      }
      
      // Reset success feedback after 3 seconds
      setTimeout(() => {
        setJustSaved(false);
      }, 3000);
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

        {/* Clean Modern Sentiment Analysis Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {/* Simple Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis</h3>
              <p className="text-sm text-gray-600">Rate the emotional tone of this feedback</p>
            </div>
          </div>

          {/* Clean Sentiment Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Sentiment
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { 
                    value: 'positive', 
                    emoji: '😊', 
                    label: 'Positive', 
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    selectedBg: 'bg-green-100',
                    selectedBorder: 'border-green-500',
                    textColor: 'text-green-700'
                  },
                  { 
                    value: 'neutral', 
                    emoji: '😐', 
                    label: 'Neutral',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200', 
                    selectedBg: 'bg-yellow-100',
                    selectedBorder: 'border-yellow-500',
                    textColor: 'text-yellow-700'
                  },
                  { 
                    value: 'negative', 
                    emoji: '😞', 
                    label: 'Negative',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    selectedBg: 'bg-red-100', 
                    selectedBorder: 'border-red-500',
                    textColor: 'text-red-700'
                  }
                ].map(({ value, emoji, label, bgColor, borderColor, selectedBg, selectedBorder, textColor }) => (
                  <button
                    key={value}
                    onClick={() => setSentiment(value as any)}
                    className={`
                      relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200
                      ${sentiment === value 
                        ? `${selectedBg} ${selectedBorder} shadow-md` 
                        : `${bgColor} ${borderColor} hover:shadow-sm hover:scale-[1.02]`
                      }
                    `}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <div className="text-left flex-1">
                      <p className={`font-medium ${sentiment === value ? textColor : 'text-gray-700'}`}>
                        {label}
                      </p>
                    </div>
                    {sentiment === value && (
                      <div className="w-5 h-5 bg-current rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              size="lg"
              className={`w-full font-semibold ${
                sentiment 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              startContent={<Save className="w-5 h-5" />}
              onPress={handleSaveAnalysis}
              isLoading={isSaving}
              isDisabled={!sentiment}
              radius="lg"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                'Save Sentiment Analysis'
              )}
            </Button>
            
            {/* Status Messages */}
            {justSaved && (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg animate-pulse">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <p className="text-sm text-green-700 font-bold">
                  🎉 Sentiment saved successfully! Status updated to "Analyzed"
                </p>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
              </div>
            )}
            
            {sentiment && !isSaving && !justSaved && (
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-blue-700 font-medium">
                  Selected: {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </p>
              </div>
            )}
            
            {(item as any)?.adminSentiment && !justSaved && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-green-700 font-medium">
                  ✓ Analysis completed
                </p>
              </div>
            )}
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
