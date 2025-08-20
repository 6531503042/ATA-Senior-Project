import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { SearchIcon } from '@/components/icons';

export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="full" position="sticky">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>{searchInput}</NavbarMenuItem>
          {siteConfig.navMenuItems.map(section => (
            <div key={section.section} className="space-y-2">
              <p className="text-xs font-semibold text-default-500 uppercase tracking-wider">
                {section.section}
              </p>
              {section.items.map((item, index) => (
                <NavbarMenuItem key={`${item.href}-${index}`}>
                  <Link
                    className="w-full"
                    color="foreground"
                    href={item.href}
                    size="lg"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </div>
                  </Link>
                </NavbarMenuItem>
              ))}
            </div>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
