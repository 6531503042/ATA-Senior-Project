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

        {/* Minimal Sentiment Section - dark purple theme */}
        <div className="rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 bg-white/10 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-semibold">Sentiment</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                {[
                  { 
                    value: 'positive', 
                    emoji: '😊', 
                    label: 'Positive',
                    ring: 'ring-emerald-400/50',
                    base: 'bg-white/5 hover:bg-white/10 text-emerald-200',
                    active: 'bg-emerald-500/20 text-emerald-100'
                  },
                  { 
                    value: 'neutral', 
                    emoji: '😐', 
                    label: 'Neutral', 
                    ring: 'ring-amber-400/50',
                    base: 'bg-white/5 hover:bg-white/10 text-amber-200',
                    active: 'bg-amber-500/20 text-amber-100'
                  },
                  { 
                    value: 'negative', 
                    emoji: '😞', 
                    label: 'Negative', 
                    ring: 'ring-rose-400/50',
                    base: 'bg-white/5 hover:bg-white/10 text-rose-200',
                    active: 'bg-rose-500/20 text-rose-100'
                  }
                ].map(({ value, emoji, label, ring, base, active }) => (
                  <button
                    key={value}
                    onClick={() => setSentiment(value as any)}
                    className={`relative flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 ring-1 ${
                      sentiment === value ? `${active} ${ring}` : `${base} ring-white/10`
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-sm font-medium text-white/90">{label}</span>
                  </button>
                ))}
              </div>
            {/* Save */}
            <div className="flex items-center gap-3">
              <Button
                size="md"
                className={`font-medium ${sentiment ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-white/5 text-white/40 cursor-not-allowed'} border border-white/10`}
                startContent={<Save className="w-4 h-4" />}
                onPress={handleSaveAnalysis}
                isLoading={isSaving}
                isDisabled={!sentiment}
                radius="lg"
              >
                Save
              </Button>
              {justSaved && <span className="text-sm text-emerald-200">Saved</span>}
              {(item as any)?.adminSentiment && !justSaved && (
                <span className="text-sm text-emerald-200">Analyzed</span>
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
