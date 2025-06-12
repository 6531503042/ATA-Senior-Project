"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SatisfactionDashboard } from "@/components/feedback";
import { PageHeader } from "@/components/layout";

export default function SatisfactionPage() {
  const params = useParams();
  const feedbackId = Number(params.id);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <PageHeader
        title="Feedback Satisfaction Analysis"
        description="Detailed satisfaction analysis and sentiment distribution for this feedback"
      />

      <SatisfactionDashboard feedbackId={feedbackId} />
    </div>
  );
}
