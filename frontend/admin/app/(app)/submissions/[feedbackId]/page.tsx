"use client";

import { useMemo, useState } from "react";
import { useSubmissions } from "@/hooks/useSubmissions";
import Header from "./_components/Header";
import SubmissionList from "./_components/SubmissionList";
import DetailsPanel from "./_components/DetailsPanel";

export default function SubmissionDetailPage({ params }: { params: { feedbackId: string } }) {
  const { allItems } = useSubmissions();
  const related = useMemo(() => allItems.filter((i) => i.feedbackId === params.feedbackId), [allItems, params.feedbackId]);
  const [selectedId, setSelectedId] = useState<string | null>(related[0]?.id ?? null);
  const current = useMemo(() => related.find((i) => i.id === selectedId) || null, [related, selectedId]);

  return (
    <div className="space-y-6">
      <Header title="Feedback Analysis" total={related.length} onBack={() => history.back()} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <SubmissionList items={related} selectedId={selectedId ?? undefined} onSelect={(id) => setSelectedId(id)} />
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-8">
          <DetailsPanel item={current} />
        </div>
      </div>
    </div>
  );
}


