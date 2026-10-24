import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import SiteLogo from '../SiteLogo';
import { ThemeToggle } from '../ui/theme-toggle';
import { UserMenu } from '../UserMenu';
import {
  FolderPlus,
  FolderTree,
  LayoutDashboard,
  MessageSquarePlus,
  MessagesSquare,
  User2,
} from 'lucide-react';
import Link from 'next/link';
import type { User } from '@/types/user';

type AppSidebarProps = {
  user: User;
};

const AppSidebar = ({ user }: AppSidebarProps) => {
  const canManageForums = user.role === 'admin' || user.role === 'owner';

  return (
    <Sidebar>
      <SidebarHeader className='border-border border-b'>
        <SiteLogo href='/' />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='mt-5'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href='/dashboard' />}>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href='/dashboard/profile' />}>
                <User2 />
                Profile
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* Admin Links */}
        {canManageForums && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSubButton
                    render={<Link href='/dashboard/categories' />}
                  >
                    <FolderTree />
                    Categories
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSubButton
                    render={<Link href='/dashboard/categories/create' />}
                  >
                    <FolderPlus />
                    Add Category
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSubButton
                    render={<Link href='/dashboard/forums' />}
                  >
                    <MessagesSquare />
                    Forums
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSubButton
                    render={<Link href='/dashboard/forums/create' />}
                  >
                    <MessageSquarePlus />
                    Add Forum
                  </SidebarMenuSubButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className='flex items-center justify-between'>
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
