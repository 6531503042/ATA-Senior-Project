'use client';

import { Button, Chip, Card, CardBody } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';

type Props = {
  title: string;
  total: number;
  onBack?: () => void;
};

export default function Header({ title, total, onBack }: Props) {
  return (
    <Card
      className="bg-white/90 dark:bg-default-50/90 backdrop-blur"
      shadow="sm"
    >
      <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            startContent={<ArrowLeft className="w-4 h-4" />}
            variant="bordered"
            onPress={onBack}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-default-500 text-sm">
              Comprehensive insights for this feedback
            </p>
          </div>
        </div>
        <Chip color="primary" size="sm" variant="flat">
          {total} Submissions
        </Chip>
      </CardBody>
    </Card>
  );
}
