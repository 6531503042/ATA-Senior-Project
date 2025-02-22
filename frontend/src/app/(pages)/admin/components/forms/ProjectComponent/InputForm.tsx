import { FolderPlus, X, Rocket } from "lucide-react";

interface ProjectFormProps {
  projectName: string;
  setProjectName: (name: string) => void;
  projectDescription: string;
  setProjectDescription: (desc: string) => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
}) => {
  return (
    <>
      <div className="w-full flex flex-col">
        <h3 className="text-sm font-medium">Project Name</h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., Website Redesign"
          className="w-full border border-zinc-200 outline-none p-3 rounded-lg mt-2 text-sm focus:shadow-sm"
          required
        />
      </div>
      <div className="w-full flex flex-col">
        <h3 className="text-sm font-medium">Description</h3>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Describe the project goals and objectives"
          className="w-full border border-zinc-200 outline-none p-3 rounded-lg mt-2 text-sm focus:shadow-sm"
        />
      </div>
    </>
  );
};
