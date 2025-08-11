"use client";

import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import SatisfactionMeterBar from "./SatisfactionMeterBar";

type Props = {
  satisfactionRate: number;
  totalSubmissions: number;
};

export default function SatisfactionOverview({ satisfactionRate, totalSubmissions }: Props) {
  return (
    <Card shadow="sm" className="bg-white/90 dark:bg-default-50/90 backdrop-blur">
      <CardHeader className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-base font-semibold">Satisfaction Overview</h3>
          <p className="text-default-500 text-sm">Total {totalSubmissions} submissions</p>
        </div>
        <Chip size="sm" variant="flat" color={satisfactionRate >= 80 ? "success" : satisfactionRate >= 60 ? "primary" : "warning"}>
          {satisfactionRate}%
        </Chip>
      </CardHeader>
      <CardBody className="pt-4">
        <SatisfactionMeterBar value={satisfactionRate} />
      </CardBody>
    </Card>
  );
}


