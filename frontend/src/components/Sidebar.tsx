/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MessageCircle,
  CircleHelp,
  LucideIcon,
  FolderClosed,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import Logo from "@assets/ata-logo.png";
import { useRouter } from "next/navigation";

interface SubMenuItem {
  name: string;
  component: string;
  color?: string;
}

interface MenuOption {
  name: string;
  component: string;
  icon: LucideIcon;
  subMenu?: SubMenuItem[];
  color?: string;
}

interface SidebarProps {
  onComponentChange: (component: string) => void;
}

const Sidebar = ({ onComponentChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<string>("overview");
  const [activeMainMenu, setActiveMainMenu] = useState<string>("Overview");
  const router = useRouter();

  const options: MenuOption[] = [
    {
      name: "Overview",
      component: "overview",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      name: "Projects",
      component: "project",
      icon: FolderClosed,
      subMenu: [
        { name: "Dashboard", component: "Project/dashboard" },
        { name: "Management", component: "Project/manage" },
      ],
    },
    {
      name: "Questions",
      component: "question",
      icon: CircleHelp,
      subMenu: [
        { name: "Dashboard", component: "Question/dashboard" },
        { name: "Management", component: "Question/manage" },
      ],
    },
    {
      name: "Feedback",
      component: "feedback",
      icon: MessageCircle,
      subMenu: [
        { name: "Dashboard", component: "Feedback/dashboard" },
        { name: "Management", component: "Feedback/manage" },
      ],
    },
  ];

  const handleMenuClick = (option: MenuOption): void => {
    if (option.subMenu && option.subMenu.length > 0) {
      setActiveSubmenu(activeSubmenu === option.name ? null : option.name);
    } else {
      onComponentChange(option.component);
      setActiveComponent(option.component);
      setActiveMainMenu(option.name);
      setActiveSubmenu(null);
    }
  };

  const handleSubmenuClick = (component: string, mainMenuName: string) => {
    onComponentChange(component);
    setActiveComponent(component);
    setActiveMainMenu(mainMenuName);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const isComponentActive = (option: MenuOption, subItem?: SubMenuItem) => {
    if (subItem) {
      return activeComponent === subItem.component;
    }
    return activeComponent === option.component;
  };

  return (
    <div
      className={`h-full bg-white shadow-xl border-r border-opacity-5 border-r-black transition-all duration-300 relative ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-4 z-30 p-1 rounded-full bg-white shadow-lg border border-gray-200"
      >
        {isOpen ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
        )}
      </button>

      <div className="w-full h-full flex flex-col items-center overflow-hidden">
        {/* Logo */}
        <Link href="/admin" className="p-3">
          <img
            src={Logo.src}
            className={`w-auto transition-all duration-300 ${
              isOpen ? "md:h-10 h-5" : "h-5"
            }`}
            alt="Logo"
          />
        </Link>
        <div className="bg-zinc-100 h-[1px] w-full" />

        {/* Menu Items */}
        <div className="w-full p-5 overflow-y-auto flex flex-col justify-between h-full gap-2">
          <ul className="w-full flex flex-col gap-2">
            {options.map((option) => {
              const Icon = option.icon;
              const hasSubmenu = option.subMenu && option.subMenu.length > 0;
              const isActive =
                isComponentActive(option) ||
                (option.subMenu?.some(
                  (subItem) => activeComponent === subItem.component
                ) ??
                  false);
              const isSubmenuOpen = activeSubmenu === option.name;

              return (
                <li key={option.component} className="w-full">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition text-sm ${
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600 font-medium hover:bg-gray-100"
                    }`}
                    onClick={() => handleMenuClick(option)}
                  >
                    <div className="flex items-center gap-5">
                      <Icon className="w-5 h-5" />
                      {isOpen && <span>{option.name}</span>}
                    </div>
                    {hasSubmenu && isOpen && (
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSubmenuOpen ? "rotate-90" : ""
                        }`}
                      />
                    )}
                  </div>

                  {/* Submenu */}
                  {hasSubmenu && isOpen && option.subMenu && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isSubmenuOpen ? "max-h-48" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-8 mt-2 space-y-2">
                        {option.subMenu.map((subItem) => (
                          <li key={subItem.component}>
                            <div
                              onClick={() =>
                                handleSubmenuClick(
                                  subItem.component,
                                  option.name
                                )
                              }
                              className={`flex py-2 px-5 text-sm rounded-lg transition cursor-pointer ${
                                isComponentActive(option, subItem)
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {subItem.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}

            {/* Sign Out Button */}
          </ul>
          <div className="flex flex-col">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 gap-5 text-sm font-medium text-red-600 bg-red-50 rounded-lg transition-all hover:bg-red-700 hover:text-white hover:shadow-md"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Sign Out</span>}
          </button>
          <div className="h-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
