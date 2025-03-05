import React from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import SentimentIndicator from './SentimentIndicator';
import { QuestionCardProps } from '@/types/employee';

const MAX_TEXT_LENGTH = 255;

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswerChange,
}: QuestionCardProps) {
  // Helper function to convert sentiment value to the correct type
  const getSentimentType = (value: string): "positive" | "neutral" | "negative" => {
    const lowercaseValue = value.toLowerCase();
    switch (lowercaseValue) {
      case "positive":
        return "positive";
      case "negative":
        return "negative";
      default:
        return "neutral";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Question Title */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900">
          {question.text}
        </h3>
        {question.description && (
          <p className="text-base text-gray-600 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Question Content */}
      <div className="mt-8">
        {question.type === 'SINGLE_CHOICE' && (
          <RadioGroup
            value={currentAnswer as string}
            onValueChange={onAnswerChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {question.answers?.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    "hover:bg-violet-50/50 hover:border-violet-200 hover:shadow-md",
                    currentAnswer === answer.value
                      ? "border-violet-500 bg-violet-50/50 shadow-md"
                      : "border-gray-200"
                  )}
                >
                  <RadioGroupItem
                    value={answer.value}
                    id={`option-${answer.value}`}
                    className="h-5 w-5 text-violet-600 border-2 border-gray-300 focus:ring-violet-500"
                  />
                  <Label
                    htmlFor={`option-${answer.value}`}
                    className="text-lg text-gray-700 cursor-pointer flex-1"
                  >
                    {answer.text}
                  </Label>
                </label>
              </motion.div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'MULTIPLE_CHOICE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.answers?.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    "hover:bg-violet-50/50 hover:border-violet-200 hover:shadow-md",
                    (currentAnswer as string[])?.includes(answer.value)
                      ? "border-violet-500 bg-violet-50/50 shadow-md"
                      : "border-gray-200"
                  )}
                >
                  <Checkbox
                    id={`checkbox-${answer.value}`}
                    checked={(currentAnswer as string[])?.includes(answer.value)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = (currentAnswer as string[]) || [];
                      if (checked) {
                        onAnswerChange([...currentAnswers, answer.value]);
                      } else {
                        onAnswerChange(currentAnswers.filter((a) => a !== answer.value));
                      }
                    }}
                    className="h-5 w-5 text-violet-600 border-2 border-gray-300 focus:ring-violet-500"
                  />
                  <Label
                    htmlFor={`checkbox-${answer.value}`}
                    className="text-lg text-gray-700 cursor-pointer flex-1"
                  >
                    {answer.text}
                  </Label>
                </label>
              </motion.div>
            ))}
          </div>
        )}

        {question.type === 'TEXT_BASED' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Textarea
              value={currentAnswer as string}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= MAX_TEXT_LENGTH) {
                  onAnswerChange(text);
                }
              }}
              placeholder="Type your answer here..."
              className="min-h-[200px] text-base p-6 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500 shadow-sm"
              maxLength={MAX_TEXT_LENGTH}
            />
            <div className="flex justify-end">
              <span className={cn(
                "text-sm",
                (currentAnswer as string)?.length >= MAX_TEXT_LENGTH * 0.9
                  ? "text-red-500 font-medium"
                  : "text-gray-500"
              )}>
                {(currentAnswer as string)?.length || 0}/{MAX_TEXT_LENGTH} characters
              </span>
            </div>
          </motion.div>
        )}

        {question.type === 'SENTIMENT' && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 py-6">
            {question.answers?.map((answer) => (
              <motion.button
                key={answer.value}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onAnswerChange(answer.value)}
                className={cn(
                  "flex flex-col items-center gap-4 p-6 rounded-2xl transition-all w-full sm:w-auto",
                  "hover:shadow-lg",
                  currentAnswer === answer.value
                    ? "bg-violet-50 ring-2 ring-violet-500 shadow-md"
                    : "bg-gray-50 hover:bg-violet-50/50"
                )}
              >
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <SentimentIndicator
                    sentiment={getSentimentType(answer.value)}
                    size={48}
                    showTooltip={false}
                  />
                </div>
                <span className="text-lg font-medium text-gray-700">
                  {answer.text}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
} 