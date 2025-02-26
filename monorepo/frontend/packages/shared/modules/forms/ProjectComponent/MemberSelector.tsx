import { ChevronDown, Plus, Trash2 } from "lucide-react";

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
  const selectedUserIds = teamMembers.map((member) => member.userId).filter(id => id !== 0);
  const getAvailableUsers = (currentMemberId: string) => {
    return postData.filter((user) => {
      const currentMember = teamMembers.find(
        (member) => member.id === currentMemberId
      );
      return (
        !selectedUserIds.includes(user.id) ||
        (currentMember && currentMember.userId === user.id)
      );
    });
  };

  const isFirstUserSelected = teamMembers.some((member) => member.userId !== 0);
  const hasAvailableUsers = postData.some(user => !selectedUserIds.includes(user.id));

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex flex-row items-center">
        <h3 className="text-sm font-medium w-full">Team Members</h3>
        <button
          type="button"
          onClick={onAddMember}
          disabled={!isFirstUserSelected || !hasAvailableUsers}
          className={`w-max border border-zinc-200 py-2 px-3 rounded-md flex flex-row items-center gap-2 transition-all duration-150 ${
            isFirstUserSelected && hasAvailableUsers
              ? "hover:bg-slate-50 hover:shadow-sm"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          <Plus className="h-4 w-4 text-slate-800" />
          <p className="text-nowrap text-slate-800 font-medium text-sm">
            Add Member
          </p>
        </button>
      </div>
      {teamMembers.map((member, index) => (
        <div key={member.id} className="flex flex-row items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg flex text-center">
            <Plus
              style={{ fontSize: "1.1rem", color: "transparent" }}
              className="stroke-blue-400 stroke-[1.5px]"
            />
          </div>
          <div className="relative w-full">
            <select
              value={member.userId}
              onChange={(e) => onMemberSelect(member.id, e)}
              className="w-full border border-zinc-200 outline-none py-3 px-3 rounded-lg text-sm font-light focus:shadow-sm appearance-none bg-white"
            >
              <option value={0} disabled hidden>
                Select team member
              </option>
              {getAvailableUsers(member.id).map((user) => (
                <option key={user.id} value={user.id}>
                  {`${user.fullname}`}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          {/* Only show remove button for non-first members */}
          {index !== 0 && (
            <button
              type="button"
              onClick={() => onRemoveMember(member.id)}
              className="p-2 bg-red-100 hover:bg-red-200 rounded-md transition-all"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};