"use client";

import React from "react";

interface SatisfactionDashboardProps {
  feedbackId: number;
}

const SatisfactionDashboard = ({ feedbackId }: SatisfactionDashboardProps) => {
  // Component temporarily disabled - needs integration with new API structure
  return (
    <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Satisfaction Dashboard</h3>
      <p className="text-gray-500">This feature is currently being updated to work with the new backend API.</p>
      <p className="text-sm text-gray-400 mt-2">Feedback ID: {feedbackId}</p>
    </div>
  );
};

export default SatisfactionDashboard;