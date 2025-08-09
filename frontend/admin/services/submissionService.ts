import raw from "@/data/submissions.json";
import type {
  SubmissionItem,
  SubmissionResponse,
  SubmissionStats,
  SubmissionFilters,
} from "@/types/submission";

function mapItem(i: any): SubmissionItem {
  return {
    id: String(i.id),
    feedbackId: String(i.feedbackId),
    feedbackTitle: String(i.feedbackTitle),
    projectName: String(i.projectName),
    submittedBy: i.submittedBy === null ? null : String(i.submittedBy),
    privacy: i.privacy === "PUBLIC" ? "PUBLIC" : "ANONYMOUS",
    submittedAt: String(i.submittedAt),
    status: i.status === "analyzed" || i.status === "pending" ? i.status : "error",
    overallSentiment:
      i.overallSentiment === "positive" ||
      i.overallSentiment === "neutral" ||
      i.overallSentiment === "negative"
        ? i.overallSentiment
        : null,
  };
}

function mapStats(s: any): SubmissionStats {
  return {
    total: Number(s.total ?? 0),
    analyzed: Number(s.analyzed ?? 0),
    pending: Number(s.pending ?? 0),
    errors: Number(s.errors ?? 0),
  };
}

export async function getSubmissions(filters?: Partial<SubmissionFilters>): Promise<SubmissionResponse> {
  const items = (raw.items || []).map(mapItem);
  const stats = mapStats(raw.stats || {});

  const query = (filters?.query || "").toLowerCase();
  const privacySet = new Set(filters?.privacy || []);
  const statusSet = new Set(filters?.status || []);

  const filtered = items.filter((it) => {
    const matchesQuery =
      !query ||
      it.id.includes(query) ||
      it.feedbackTitle.toLowerCase().includes(query) ||
      it.projectName.toLowerCase().includes(query) ||
      (it.submittedBy || "").includes(query);
    const matchesPrivacy = privacySet.size === 0 || privacySet.has(it.privacy);
    const matchesStatus = statusSet.size === 0 || statusSet.has(it.status);
    return matchesQuery && matchesPrivacy && matchesStatus;
  });

  return { items: filtered, stats };
}


