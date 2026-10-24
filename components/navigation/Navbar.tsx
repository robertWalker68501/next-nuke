import { NAV_LINKS } from '@/constants';
import SiteLogo from '../SiteLogo';
import NavLink from './NavLink';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from '../ui/theme-toggle';
import { Suspense } from 'react';
import { Spinner } from '../ui/spinner';
import UserSession from '../auth/UserSession';

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between'>
      {/* Site logo */}
      <SiteLogo href='/' />

      {/* Desktop nav */}
      <div className='hidden items-center gap-4 md:flex'>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            label={link.label}
          />
        ))}
        <Suspense fallback={<Spinner />}>
          <UserSession />
        </Suspense>
        <ThemeToggle />
      </div>

      {/* Mobile nav */}
      <div className='block md:hidden'>
        <MobileNav
          userControls={
            <Suspense fallback={<Spinner />}>
              <UserSession />
            </Suspense>
          }
        />
      </div>
    </nav>
  );
};

export default Navbar;
