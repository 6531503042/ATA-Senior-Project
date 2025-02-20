import { ChevronDown, Plus, Trash2 } from "lucide-react";
import GroupsIcon from "@mui/icons-material/Groups";

interface TeamMember {
  id: string;
  userId: number;
}

interface Post {
  id: number;
  fullname: string;
  roles: string;
}

interface TeamMemberSelectorProps {
  teamMembers: TeamMember[];
  postData: Post[];
  onAddMember: () => void;
  onRemoveMember: (id: string) => void;
  onMemberSelect: (id: string, event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  teamMembers,
  postData,
  onAddMember,
  onRemoveMember,
  onMemberSelect,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex flex-row items-center">
        <h3 className="text-sm font-medium w-full">Team Members</h3>
        <button
          type="button"
          onClick={onAddMember}
          className="w-max border border-zinc-200 py-2 px-3 rounded-md flex flex-row items-center gap-2 hover:bg-slate-50 transition-all duration-150 hover:shadow-sm"
        >
          <Plus className="h-4 w-4 text-slate-800" />
          <p className="text-nowrap text-slate-800 font-medium text-sm">
            Add Member
          </p>
        </button>
      </div>
      {teamMembers.map((member) => (
        <div key={member.id} className="flex flex-row items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex text-center">
            <GroupsIcon
              style={{ fontSize: "1.1rem", color: "transparent" }}
              className="stroke-blue-400 stroke-[1.5px]"
            />
          </div>
          <div className="relative w-full">
            <select
              value={member.userId}
              onChange={(e) => onMemberSelect(member.id, e)}
              className="w-full border border-zinc-200 outline-none p-3 rounded-lg text-sm font-light focus:shadow-sm appearance-none pr-10 bg-transparent"
            >
              <option value={0}>Select team member</option>
              {postData.map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.fullname} (ID: ${user.id})`}
                </option>
              ))}
            </select>
            {member.userId !== 0 && (
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Selected ID: {member.userId}
              </span>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemoveMember(member.id)}
            className="p-2 bg-red-100 hover:bg-red-200 rounded-md transition-all"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      ))}
    </div>
  );
};