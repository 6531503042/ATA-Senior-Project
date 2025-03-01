import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Ellipsis } from "lucide-react";

export default function App() {
  return (
    <Dropdown >
      <DropdownTrigger >
        <Ellipsis className="cursor-pointer text-zinc-500 w-5 h-5"/>
      </DropdownTrigger>
      <DropdownMenu aria-label="Action event example" onAction={(key) => alert(key)}>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}