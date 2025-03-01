import React from "react";

const SentimentOptions: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <h3 className="text-sm font-medium mb-2">Sentiment Options</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
          <div className="text-red-500">Negative</div>
        </div>
        <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
          <div className="text-gray-500">Neutral</div>
        </div>
        <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-md">
          <div className="text-green-500">Positive</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentOptions;