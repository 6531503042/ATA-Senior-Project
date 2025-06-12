"use client";

import React from "react";
import { DatePicker } from "@/components/shared/date-picker";
import { ProjectStatus } from "../models/types";
import "../styles/ProjectFilters.css";

interface ProjectFiltersProps {
  filters: {
    search: string;
    status: ProjectStatus[];
    startDate?: Date;
    endDate?: Date;
  };
  onFilterChange: (name: string, value: unknown) => void;
}

export function ProjectFilters({
  filters,
  onFilterChange,
}: ProjectFiltersProps) {
  const statusOptions = Object.values(ProjectStatus);

  return (
    <div className="project-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label>Status</label>
        <div className="status-options">
          {statusOptions.map((status) => (
            <label key={status} className="status-checkbox">
              <input
                type="checkbox"
                checked={filters.status.includes(status)}
                onChange={(e) => {
                  const newStatus = e.target.checked
                    ? [...filters.status, status]
                    : filters.status.filter((s) => s !== status);
                  onFilterChange("status", newStatus);
                }}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group date-filters">
        <DatePicker
          label="Start Date"
          date={filters.startDate}
          setDate={(date) => onFilterChange("startDate", date)}
        />
        <DatePicker
          label="End Date"
          date={filters.endDate}
          setDate={(date) => onFilterChange("endDate", date)}
          minDate={filters.startDate}
        />
      </div>
    </div>
  );
}
