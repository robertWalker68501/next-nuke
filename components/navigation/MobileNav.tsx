'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import SiteLogo from '../SiteLogo';
import { NAV_LINKS } from '@/constants';
import NavLink from './NavLink';
import { ThemeToggle } from '../ui/theme-toggle';

type MobileNavProps = {
  userControls: ReactNode;
};

export const MobileNav = ({ userControls }: MobileNavProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger>
        <Menu size={22} />
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>
            <SiteLogo
              href='/'
              onClick={handleOpen}
            />
          </SheetTitle>
          <SheetDescription>
            A next generation forum created in Next.js
          </SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-4 px-4'>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              href={link.href}
              label={link.label}
              onClick={handleOpen}
              isMobile
            />
          ))}
        </div>
        <SheetFooter>
          <div className='flex items-center justify-between'>
            <ThemeToggle />
            {userControls}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
