import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionOption,
} from '@/types/question';

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
  Checkbox,
  Divider,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import {
  MessageSquareIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  StarIcon,
  ToggleLeftIcon,
} from 'lucide-react';
import { useQuestionMeta } from '@/hooks/useQuestionMeta';

interface QuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: CreateQuestionRequest | UpdateQuestionRequest) => void;
  question?: Question;
  mode: 'create' | 'edit';
}

export function QuestionsModal({
  isOpen,
  onClose,
  onSubmit,
  question,
  mode,
}: QuestionsModalProps) {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    text: question?.text || '',
    type: question?.type || 'TEXT',
    required: question?.required || false,
    order: question?.order || 1,
    category: question?.category || 'general',
    options: question?.options || [],
  });

  const [newOption, setNewOption] = useState('');

  // Reset form when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen && question) {
      setFormData({
        text: question.text,
        type: question.type,
        required: question.required,
        order: question.order,
        category: question.category,
        options: question.options || [],
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        text: '',
        type: 'TEXT',
        required: false,
        order: 1,
        category: 'general',
        options: [],
      });
    }
  }, [isOpen, question, mode]);

  // Prevent body scroll and layout shift when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.classList.add('modal-open');
      document.body.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`,
      );

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
        ...formData,
      } as UpdateQuestionRequest);
    }
    onClose();
  };

  const addOption = () => {
    if (newOption.trim() && formData.options) {
      const option: Omit<QuestionOption, 'id'> = {
        text: newOption.trim(),
        value: newOption.trim(),
        order: (formData.options?.length || 0) + 1,
      };

      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), option],
      }));
      setNewOption('');
    }
  };

  const removeOption = (optionIndexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      options:
        prev.options?.filter((_, index) => index !== optionIndexToRemove) || [],
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'TEXT':
        return <MessageSquareIcon className="w-4 h-4" />;
      case 'RATING':
        return <StarIcon className="w-4 h-4" />;
      case 'BOOLEAN':
        return <ToggleLeftIcon className="w-4 h-4" />;
      default:
        return <MessageSquareIcon className="w-4 h-4" />;
    }
  };

  // Dynamic question metadata (types/categories) with fallbacks and emoji labels
  const { meta } = useQuestionMeta();
  
  const typeEmoji = (key: string) => {
    switch ((key || '').toUpperCase()) {
      case 'TEXT':
        return '💬';
      case 'MULTIPLE_CHOICE':
        return '🧩';
      case 'RATING':
        return '⭐️';
      case 'BOOLEAN':
        return '🔘';
      default:
        return '❓';
    }
  };

  const categoryEmoji = (key: string) => {
    const k = (key || '').toLowerCase();
    if (k.includes('project')) return '📦';
    if (k.includes('technical') || k.includes('skill')) return '🛠️';
    if (k.includes('communication')) return '🗣️';
    if (k.includes('leadership')) return '👑';
    if (k.includes('environment')) return '🏢';
    if (k.includes('balance')) return '⚖️';
    if (k.includes('team')) return '🤝';
    if (k.includes('general')) return '🏷️';
    return '🏷️';
  };

  const handleTypeChange = (nextType: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'BOOLEAN') => {
    setFormData(prev => {
      let nextOptions: CreateQuestionRequest['options'] = prev.options;

      if (nextType === 'MULTIPLE_CHOICE') {
        if (!prev.options || prev.options.length === 0) {
          nextOptions = [
            { text: 'Option 1', value: 'Option 1', order: 1 },
            { text: 'Option 2', value: 'Option 2', order: 2 },
          ];
        }
      } else if (nextType === 'BOOLEAN') {
        nextOptions = [
          { text: 'Yes', value: 'YES', order: 1 },
          { text: 'No', value: 'NO', order: 2 },
        ];
      } else {
        nextOptions = [];
      }

      return { ...prev, type: nextType, options: nextOptions };
    });
  };

  return (
    <Modal
      backdrop="blur"
      className="mx-4"
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        wrapper: 'overflow-hidden',
        base: 'overflow-hidden',
      }}
      hideCloseButton={false}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      placement="center"
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <h2 className="text-xl font-bold text-default-900">
            {mode === 'create' ? 'Create New Question' : 'Edit Question'}
          </h2>
          <p className="text-sm text-default-600 dark:text-gray-400">
            {mode === 'create'
              ? 'Add a new question to your feedback system'
              : 'Update question information'}
          </p>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 overflow-y-auto">
          <Input
            isRequired
            className="w-full"
            label="Question Text"
            placeholder="Enter your question"
            size="lg"
            value={formData.text}
            variant="bordered"
            onChange={e => setFormData({ ...formData, text: e.target.value })}
          />

          <Textarea
            className="w-full"
            label="Additional Context"
            maxRows={5}
            minRows={3}
            placeholder="Add additional context or instructions (optional)"
            value={formData.options && formData.options.length > 0 ? formData.options.map(o => o.text).join('\n') : ''}
            variant="bordered"
            onChange={e => {
              const text = e.target.value;
              const lines = text.split('\n').filter(line => line.trim() !== '');
              const options = lines.map((line, index) => ({
                text: line.trim(),
                value: line.trim(),
                order: index + 1,
              }));
              setFormData({ ...formData, options });
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              isRequired
              className="w-full"
              label="Question Type"
              placeholder="Select question type"
              selectedKeys={[formData.type]}
              variant="bordered"
              onChange={e => handleTypeChange(e.target.value as 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' | 'BOOLEAN')}
            >
              {meta.types.map(type => (
                <SelectItem key={type.key} textValue={type.label}>
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{typeEmoji(type.key)}</span>
                    <span>{type.label}</span>
                  </span>
                </SelectItem>
              ))}
            </Select>

            <Select
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setFormData(prev => ({ ...prev, category: selected }));
              }}
              placeholder="Select category"
              classNames={{
                trigger: "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500 transition-colors duration-200",
              }}
            >
              {meta.categories.map(category => (
                <SelectItem key={category.key} textValue={category.label}>
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{categoryEmoji(category.key)}</span>
                    <span>{category.label}</span>
                  </span>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Options Section for Choice Questions */}
          {(formData.type === 'MULTIPLE_CHOICE' || formData.type === 'BOOLEAN') && (
            <div className="space-y-4">
              <Divider />
              <div>
                <h3 className="text-sm font-medium text-default-700 mb-3">
                  {formData.type === 'BOOLEAN' ? 'Boolean Options' : 'Answer Options'}
                </h3>
                <div className="space-y-3">
                  {formData.type === 'MULTIPLE_CHOICE' && (
                    <div className="flex gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Add an option"
                        value={newOption}
                        variant="bordered"
                        onChange={e => setNewOption(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOption();
                          }
                        }}
                      />
                      <Button
                        isDisabled={!newOption.trim()}
                        startContent={<PlusIcon className="w-4 h-4" />}
                        variant="bordered"
                        onPress={addOption}
                      >
                        Add
                      </Button>
                    </div>
                  )}

                  {formData.options && formData.options.length > 0 && (
                    <div className="space-y-2">
                      {formData.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-default-50 rounded-lg"
                        >
                          <span className="text-sm font-medium text-default-600 min-w-[30px]">
                            {index + 1}.
                          </span>
                          <Input
                            className="flex-1"
                            size="sm"
                            value={option.text}
                            variant="bordered"
                            onChange={e => {
                              const text = e.target.value;
                              setFormData(prev => {
                                const next = [...(prev.options || [])];
                                next[index] = { ...next[index], text, value: text } as any;
                                return { ...prev, options: next };
                              });
                            }}
                          />
                          {formData.type === 'MULTIPLE_CHOICE' && (
                            <Button
                              isIconOnly
                              className="text-default-400 hover:text-red-600"
                              size="sm"
                              variant="light"
                              onPress={() => removeOption(index)}
                            >
                              <XIcon className="w-4 h-4" />
                            </Button>
                          )}
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
              color="primary"
              isSelected={formData.required}
              onValueChange={checked =>
                setFormData({ ...formData, required: checked })
              }
            />
            <span className="text-sm font-medium text-default-700">
              Make this question required
            </span>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-default-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
          <Button className="font-medium" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600"
            color="primary"
            isDisabled={!formData.text}
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={handleSubmit}
          >
            {mode === 'create' ? 'Create Question' : 'Update Question'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
