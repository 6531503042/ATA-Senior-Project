import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackHeaderProps {
}

export const FeedbackHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-ata-blue">Feedback Forms</h1>
      <p className="text-ata-text mt-2">Manage your feedback collection forms</p>
    </div>
  );
};
