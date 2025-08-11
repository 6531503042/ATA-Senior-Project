import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Checkbox,
  Divider
} from "@heroui/react";
import { useState, useEffect } from "react";
import { 
  MessageSquareIcon, 
  PlusIcon, 
  XIcon,
  CheckCircleIcon,
  StarIcon,
  ToggleLeftIcon
} from "lucide-react";
import type { Question, CreateQuestionRequest, UpdateQuestionRequest, QuestionType, QuestionCategory, AnswerOption } from "@/types/question";

interface QuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: CreateQuestionRequest | UpdateQuestionRequest) => void;
  question?: Question;
  mode: "create" | "edit";
}

export function QuestionsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  question, 
  mode 
}: QuestionsModalProps) {
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    title: question?.title || "",
    description: question?.description || "",
    type: question?.type || "text_based",
    category: question?.category || "general",
    options: question?.options || [],
    required: question?.required || false
  });

  const [newOption, setNewOption] = useState("");

  // Reset form when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen && question) {
      setFormData({
        title: question.title,
        description: question.description || "",
        type: question.type,
        category: question.category,
        options: question.options || [],
        required: question.required
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        title: "",
        description: "",
        type: "text_based",
        category: "general",
        options: [],
        required: false
      });
    }
  }, [isOpen, question, mode]);

  // Prevent body scroll and layout shift when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add('modal-open');
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      
      return () => {
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('--scrollbar-width');
      };
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (mode === 'create') {
      onSubmit(formData);
    } else if (question) {
      onSubmit({
        id: question.id,
        ...formData
      });
    }
    onClose();
  };

  const addOption = () => {
    if (newOption.trim() && formData.options) {
      const option: AnswerOption = {
        id: Date.now().toString(),
        text: newOption.trim(),
        value: newOption.trim()
      };
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), option]
      }));
      setNewOption("");
    }
  };

  const removeOption = (optionIdToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter(option => option.id !== optionIdToRemove) || []
    }));
  };

  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'single_choice':
      case 'multiple_choice':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'text_based':
        return <MessageSquareIcon className="w-4 h-4" />;
      case 'rating':
        return <StarIcon className="w-4 h-4" />;
      case 'boolean':
        return <ToggleLeftIcon className="w-4 h-4" />;
      default:
        return <MessageSquareIcon className="w-4 h-4" />;
    }
  };

  const questionTypes = [
    { key: "single_choice", label: "Single Choice", icon: <CheckCircleIcon className="w-4 h-4" /> },
    { key: "multiple_choice", label: "Multiple Choice", icon: <CheckCircleIcon className="w-4 h-4" /> },
    { key: "text_based", label: "Text Based", icon: <MessageSquareIcon className="w-4 h-4" /> },
    { key: "rating", label: "Rating", icon: <StarIcon className="w-4 h-4" /> },
    { key: "boolean", label: "Boolean", icon: <ToggleLeftIcon className="w-4 h-4" /> },
  ];

  const categories = [
    { key: "project_satisfaction", label: "Project Satisfaction" },
    { key: "technical_skills", label: "Technical Skills" },
    { key: "communication", label: "Communication" },
    { key: "leadership", label: "Leadership" },
    { key: "work_environment", label: "Work Environment" },
    { key: "work_life_balance", label: "Work Life Balance" },
    { key: "team_collaboration", label: "Team Collaboration" },
    { key: "general", label: "General" },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      hideCloseButton={false}
      className="mx-4"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        wrapper: "overflow-hidden",
        base: "overflow-hidden",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <h2 className="text-xl font-bold text-default-900">
            {mode === "create" ? "Create New Question" : "Edit Question"}
          </h2>
          <p className="text-sm text-default-600">
            {mode === "create" ? "Add a new question to your feedback system" : "Update question information"}
          </p>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <Input
            label="Question Title"
            placeholder="Enter your question"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            isRequired
            variant="bordered"
            size="lg"
            className="w-full"
          />
          
          <Textarea
            label="Description"
            placeholder="Add additional context or instructions"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            minRows={3}
            maxRows={5}
            variant="bordered"
            className="w-full"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Question Type"
              placeholder="Select question type"
              selectedKeys={[formData.type]}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestionType })}
              isRequired
              variant="bordered"
              className="w-full"
            >
              {questionTypes.map((type) => (
                <SelectItem key={type.key} startContent={type.icon}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            
            <Select
              label="Category"
              placeholder="Select category"
              selectedKeys={[formData.category]}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as QuestionCategory })}
              isRequired
              variant="bordered"
              className="w-full"
            >
              {categories.map((category) => (
                <SelectItem key={category.key}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Options Section for Choice Questions */}
          {(formData.type === 'single_choice' || formData.type === 'multiple_choice' || formData.type === 'rating') && (
            <div className="space-y-4">
              <Divider />
              <div>
                <h3 className="text-sm font-medium text-default-700 mb-3">Answer Options</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      variant="bordered"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addOption();
                        }
                      }}
                    />
                    <Button
                      variant="bordered"
                      startContent={<PlusIcon className="w-4 h-4" />}
                      onPress={addOption}
                      isDisabled={!newOption.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.options && formData.options.length > 0 && (
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2 p-2 bg-default-50 rounded-lg">
                          <span className="text-sm font-medium text-default-600 min-w-[30px]">
                            {index + 1}.
                          </span>
                          <span className="text-sm text-default-700 flex-1">
                            {option.text}
                          </span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-default-400 hover:text-red-600"
                            onPress={() => removeOption(option.id)}
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Required Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={formData.required}
              onValueChange={(checked) => setFormData({ ...formData, required: checked })}
              color="primary"
            />
            <span className="text-sm font-medium text-default-700">
              Make this question required
            </span>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button 
            variant="light" 
            onPress={onClose}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isDisabled={!formData.title}
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
            startContent={<PlusIcon className="w-4 h-4" />}
          >
            {mode === "create" ? "Create Question" : "Update Question"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
