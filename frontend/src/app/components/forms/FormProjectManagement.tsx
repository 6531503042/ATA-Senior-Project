"use client";

import React, { useEffect, useState } from "react";
import { DatePickerWithPresets } from "@/app/components/forms/ProjectComponent/DatePicker";
import { TeamMemberSelector } from "@/app/components/forms/ProjectComponent/MemberSelector";
import { ProjectForm } from "@/app/components/forms/ProjectComponent/InputForm";
import { FolderPlus, X, Rocket } from "lucide-react";

interface CreateProjectForm {
  setIsOpen: (isOpen: boolean) => void;
}

interface TeamMember {
  id: string;
  userId: number;
}

export interface Post {
  id: number;
  fullname: string;
  roles: string;
}

const CreateProjectForm: React.FC<CreateProjectForm> = ({ setIsOpen }) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", userId: 0 },
  ]);
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [postData, setPostData] = useState<Post[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false);

  const handleAddMember = () => {
    const newId = (teamMembers.length + 1).toString();
    setTeamMembers([...teamMembers, { id: newId, userId: 0 }]);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const handleMemberSelect = (
    id: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const userId = parseInt(event.target.value);

    const isDuplicate = teamMembers.some(
      (member) => member.id !== id && member.userId === userId
    );

    if (isDuplicate && userId !== 0) {
      setDuplicateWarning(true);

      setTimeout(() => setDuplicateWarning(false), 5000);

      return;
    }

    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, userId } : member
      )
    );
  };

  const getPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch("http://localhost:8081/api/manager/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

      const data = await res.json();
      setPostData(
        data.filter((user: Post) => user.roles.includes("ROLE_USER"))
      );
    } catch (error) {
      console.error("Error loading post:", error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formattedStartDate = startDate ? startDate.toISOString() : null;
      const formattedEndDate = dueDate ? dueDate.toISOString() : null;

      const projectData = {
        name: projectName,
        description: projectDescription,
        projectStartDate: formattedStartDate,
        projectEndDate: formattedEndDate,
      };

      const projectResponse = await fetch(
        "http://localhost:8084/api/v1/admin/projects/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!projectResponse.ok) {
        throw new Error(`Failed to create project: ${projectResponse.status}`);
      }

      const projectResult = await projectResponse.json();
      const projectId = projectResult.id;

      console.log("Project Created:", projectResult);

      if (projectId && teamMembers.length > 0) {
        const memberIds = teamMembers
          .map((member) => member.userId)
          .filter((id) => id !== 0);

        if (memberIds.length > 0) {
          const addMembersResponse = await fetch(
            `http://localhost:8084/api/v1/admin/projects/${projectId}/members`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ memberIds }),
            }
          );

          if (!addMembersResponse.ok) {
            throw new Error(
              `Failed to add members: ${addMembersResponse.status}`
            );
          }

          console.log(
            "Members Added Successfully:",
            await addMembersResponse.json()
          );
        }
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      {duplicateWarning && (
        <div className="fixed top-5 z-50 right-5 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-">
          <X className="w-5 h-5" />
          <p className="text-sm font-medium">
            Already added! Please choose another.
          </p>
        </div>
      )}
      <div className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3 w-[600px] max-h-full overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row">
          <div className="w-full flex flex-col gap-1 mt-2">
            <div className="flex flex-row gap-2 items-center">
              <FolderPlus className="h-6 w-6 text-violet-500" />
              <h1 className="text-2xl font-semibold">Create New Project</h1>
            </div>
            <p className="text-zinc-400 text-sm font-normal">
              Launch a new project and set it up for success
            </p>
          </div>
          <button
            className="flex-1 flex justify-end"
            onClick={() => setIsOpen(false)}
          >
            <X className="text-slate-600 h-4 w-4 hover:text-slate-900" />
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6 mt-5">
          <ProjectForm
            projectName={projectName}
            setProjectName={setProjectName}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
          />

          <div className="w-full flex flex-row gap-5">
            <DatePickerWithPresets
              date={startDate}
              setDate={setStartDate}
              label="Start Date"
            />
            <DatePickerWithPresets
              date={dueDate}
              setDate={setDueDate}
              label="Due Date"
              startDate={startDate}
            />
          </div>

          <TeamMemberSelector
            teamMembers={teamMembers}
            postData={postData}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onMemberSelect={handleMemberSelect}
          />

          {/* Action Buttons */}
          <div className="w-full flex flex-row justify-end gap-3">
            <button
              type="button"
              className="border border-zinc-300 py-2 px-3 text-sm rounded-md hover:shadow-lg hover:shadow-zinc-200 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="border border-transparent bg-blue-800 py-2 px-3 text-sm rounded-md flex flex-row items-center gap-2 text-white hover:shadow-lg hover:shadow-blue-200 transition-all"
              onClick={handleCreateProject}
            >
              <Rocket className="h-4 w-4" />
              <p>Launch Project</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
