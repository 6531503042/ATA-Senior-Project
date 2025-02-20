import { Rocket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Post, CreateFeedbackFormData, FeedbackFormResponse } from './types';
import FormHeader from './FormHeader';
import FormBody from './FormBody';
import QuestionSection from './QuestionSection';

interface CreateFeedbackFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const CreateFeedbackForm: React.FC<CreateFeedbackFormProps> = ({ setIsOpen }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [postData, setPostData] = useState<Post[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        "http://localhost:8084/api/v1/admin/questions/get-all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json();
      setPostData(data);
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !dueDate || !title || selectedQuestions.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("access_token");
      const formData: CreateFeedbackFormData = {
        title,
        description,
        projectId: 1,
        questionIds: selectedQuestions,
        startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(dueDate, "yyyy-MM-dd'T'HH:mm:ss")
      };

      const response = await fetch(
        "http://localhost:8084/api/v1/admin/feedbacks/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create feedback form: ${response.status}`);
      }

      const result: FeedbackFormResponse = await response.json();
      console.log("Feedback form created:", result);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating feedback form:", error);
      alert("Failed to create feedback form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[900px] max-h-full overflow-y-auto">
        <FormHeader setIsOpen={setIsOpen} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-5">
          <FormBody
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            startDate={startDate}
            setStartDate={setStartDate}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />

          <QuestionSection
            postData={postData}
            selectedQuestions={selectedQuestions}
            onToggleQuestion={toggleQuestionSelection}
          />

          <div className="w-full flex flex-row justify-end gap-3">
            <button
              type="button"
              className="border border-zinc-300 py-2 px-3 text-sm rounded-md hover:shadow-lg hover:shadow-zinc-200 transition-all"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-transparent bg-red-800 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Rocket className="h-4 w-4" />
              <p>{isSubmitting ? "Creating..." : "Create Form"}</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeedbackForm;