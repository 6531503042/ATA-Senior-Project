"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";

const feedbackList = [
  { id: 1, title: "Workplace Environment", completed: true },
  { id: 2, title: "Management & Leadership", completed: false },
  { id: 3, title: "Team Collaboration", completed: false },
];

const questions = [
  "How satisfied are you with the workplace environment?",
  "Do you feel valued by management?",
  "How would you rate team collaboration?",
];

const UserFeedbackPage = () => {
  const [currentFeedback, setCurrentFeedback] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [selectedPrivacy, setSelectedPrivacy] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const startFeedback = (id: number) => {
    setCurrentFeedback(id);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(""));
    setSelectedPrivacy(null);
    setSubmitted(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handlePrivacySelection = (privacy: string) => {
    setSelectedPrivacy(privacy);
  };

  const backToDashboard = () => {
    setCurrentFeedback(null);
  };

  const getOptionBgColor = (option: string, selected: boolean) => {
    if (!selected) return "bg-white hover:bg-gray-50";
    
    switch (option) {
      case "Strongly Agree": return "bg-emerald-50 border-emerald-300";
      case "Agree": return "bg-emerald-50 border-emerald-200";
      case "Neutral": return "bg-gray-50 border-gray-300";
      case "Disagree": return "bg-red-50 border-red-200";
      case "Strongly Disagree": return "bg-red-50 border-red-300";
      default: return "bg-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">
        Your Feedback
      </h1>

      {currentFeedback === null ? (
        // Feedback Dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackList.map((feedback) => (
            <Card key={feedback.id} className="w-80 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 overflow-hidden">
              <CardHeader className="pb-2 bg-slate-50">
                <CardTitle className="text-slate-700 text-lg">{feedback.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-4">
                {feedback.completed ? (
                  <div className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </div>
                ) : (
                  <Button 
                    onClick={() => startFeedback(feedback.id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    Start
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !submitted ? (
        // Feedback Form
        <div className="w-full max-w-md">
          <Card className="border border-slate-200 shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={currentQuestion > 0 ? prevQuestion : backToDashboard}
                  className="text-slate-600 hover:text-slate-900 -ml-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {currentQuestion > 0 ? "Back" : "Dashboard"}
                </Button>
                <span className="text-sm font-medium text-slate-500">
                  Step {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <CardTitle className="text-xl text-slate-800 mt-2">
                {feedbackList.find(f => f.id === currentFeedback)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-700 mb-5 text-lg">{questions[currentQuestion]}</p>
              <div className="space-y-3 mb-6">
                {["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"].map((option) => (
                  <div
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                      getOptionBgColor(option, answers[currentQuestion] === option)
                    } ${answers[currentQuestion] === option ? 'border-2' : 'border'}`}
                  >
                    <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 border ${
                      answers[currentQuestion] === option 
                        ? 'border-indigo-500 bg-indigo-500' 
                        : 'border-slate-300'
                    }`}>
                      {answers[currentQuestion] === option && (
                        <div className="w-1 h-1 rounded-full bg-white m-auto"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      answers[currentQuestion] === option 
                        ? 'text-slate-800' 
                        : 'text-slate-600'
                    }`}>{option}</span>
                  </div>
                ))}
              </div>

              <Progress 
                value={(currentQuestion + 1) / questions.length * 100} 
                className="w-full h-1.5 bg-slate-100"
              />

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>Next <ArrowRight className="ml-1 w-4 h-4" /></>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : selectedPrivacy === null ? (
        // Privacy Selection
        <div className="w-full max-w-md">
          <Card className="border border-slate-200 shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-xl text-slate-800">Choose Privacy Setting</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-600 mb-5">Who should see your feedback?</p>
              <div className="space-y-3">
                {[
                  { name: "All Employees", desc: "Visible to the entire company" },
                  { name: "HR Only", desc: "Only visible to HR personnel" },
                  { name: "Anonymous", desc: "Your identity will be kept private" }
                ].map((option) => (
                  <div
                    key={option.name}
                    onClick={() => handlePrivacySelection(option.name)}
                    className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{option.name}</span>
                      <span className="text-sm text-slate-500 mt-1">{option.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="text-slate-600 border-slate-300"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Completion Screen
        <div className="w-full max-w-md">
          <Card className="p-8 text-center border border-slate-200 shadow-md">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <CardTitle className="text-xl text-slate-800 mb-3">Feedback Submitted!</CardTitle>
            <p className="text-slate-600 mb-1">Thank you for your valuable input.</p>
            <p className="text-slate-500 text-sm mb-6">Your feedback is now {selectedPrivacy.toLowerCase()}.</p>
            <Button 
              onClick={backToDashboard}
              className="bg-indigo-500 hover:bg-indigo-600 text-white mx-auto"
            >
              Return to Dashboard
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserFeedbackPage;