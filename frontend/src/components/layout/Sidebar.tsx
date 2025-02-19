import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  FolderIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Accordion, AccordionItem } from "@nextui-org/react";

const navigation = [
  {
    name: 'Overview',
    href: '/',
    icon: ChartBarIcon,
    type: 'link'
  },
  {
    name: 'Projects',
    icon: FolderIcon,
    type: 'group',
    items: [
      { name: 'Manage', href: '/admin/projects' },
      { name: 'Dashboard', href: '/admin/projects/dashboard' }
    ]
  },
  {
    name: 'Questions',
    icon: QuestionMarkCircleIcon,
    type: 'group',
    items: [
      { name: 'Manage', href: '/admin/questions' },
      { name: 'Dashboard', href: '/admin/questions/dashboard' }
    ]
  },
  {
    name: 'Feedback',
    icon: ChatBubbleLeftRightIcon,
    type: 'group',
    items: [
      { name: 'Manage', href: '/admin/feedback' },
      { name: 'Dashboard', href: '/admin/feedback/dashboard' }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  const renderNavItem = (item: any) => {
    if (item.type === 'link') {
      const isActive = location.pathname === item.href;
      return (
        <Link
          key={item.name}
          to={item.href}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          {item.name}
        </Link>
      );
    }

    const isGroupActive = item.items.some((subItem: any) => location.pathname === subItem.href);
    const Icon = item.icon;

    return (
      <Accordion
        key={item.name}
        variant="light"
        className="px-0"
        itemClasses={{
          base: "py-0 w-full",
          title: "font-medium text-sm",
          trigger: `py-2 px-3 rounded-lg transition-all duration-200 data-[hover=true]:bg-gray-100 ${
            isGroupActive ? 'text-primary' : 'text-gray-600'
          }`,
          indicator: "text-gray-400",
          content: "py-0 px-3"
        }}
      >
        <AccordionItem
          key={item.name}
          aria-label={item.name}
          title={
            <div className="flex items-center">
              <Icon className={`mr-3 h-5 w-5 ${isGroupActive ? 'text-primary' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </div>
          }
          indicator={<ChevronDownIcon className="h-4 w-4" />}
        >
          <div className="flex flex-col space-y-1 pl-8">
            {item.items.map((subItem: any) => {
              const isSubItemActive = location.pathname === subItem.href;
              return (
                <Link
                  key={subItem.name}
                  to={subItem.href}
                  className={`py-2 text-sm rounded-md transition-colors ${
                    isSubItemActive
                      ? 'text-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        </AccordionItem>
      </Accordion>
    );
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background/80 backdrop-blur-xl border-r">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Sentiment
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
