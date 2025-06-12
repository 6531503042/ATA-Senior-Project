import React from "react";

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Feedback Submissions
          </h2>
          <p className="text-muted-foreground">
            View and analyze feedback submissions from your team
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
