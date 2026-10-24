'use client';

import { cn } from 'cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  label: string;
  classNames?: string;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLink = ({
  href,
  label,
  classNames,
  onClick,
  isMobile,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'hover:text-primary text-xs font-bold uppercase transition-colors duration-300',
        isActive && 'text-primary',
        isMobile && 'text-lg',
        classNames
      )}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default NavLink;
