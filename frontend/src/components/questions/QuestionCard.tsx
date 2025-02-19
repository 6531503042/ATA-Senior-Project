
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MessageSquare } from "lucide-react";
// import { Question } from "@/types/question";

// interface QuestionCardProps {
//   question: Question;
// }

// export const QuestionCard = ({ question }: QuestionCardProps) => {
//   return (
//     <Card className="p-6 hover:shadow-lg transition-shadow">
//       <div className="space-y-4">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-2">
//             <MessageSquare className="h-5 w-5 text-ata-blue" />
//             <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//               {question.type}
//             </span>
//           </div>
//           <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
//             {question.category}
//           </span>
//         </div>
        
//         <div>
//           <h3 className="font-semibold text-lg text-ata-blue mb-2">{question.text}</h3>
//           <p className="text-sm text-ata-text">{question.content}</p>
//         </div>
        
//         <div className="flex flex-wrap gap-2">
//           {question.answers.map((answer, index) => (
//             <span
//               key={index}
//               className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
//             >
//               {answer.text}
//             </span>
//           ))}
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-sm text-ata-text">
//             {question.required ? "Required" : "Optional"}
//           </span>
//           <Button variant="ghost" size="sm">
//             Edit Question
//           </Button>
//         </div>
//       </div>
//     </Card>
//   );
// };
