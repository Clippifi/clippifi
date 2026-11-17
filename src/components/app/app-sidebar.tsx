"use client";

import Link from "next/link";
import { creatorNav, isActive } from "@/components/app/nav";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, Settings } from "@/components/icons";
import Logo from "@/components/Logo";
import { UserAvatar } from "@/components/app/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";


type SidebarUser = { name: string; email: string; image?: string | null };

export function AppSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo and the collapse toggle live together, so the toggle never scrolls away.
          Expanded: one row, toggle beside the divider. Collapsed: a column, toggle under the symbol. */}
      {/* Logo and the collapse toggle live together, so the toggle never scrolls away.
          Expanded: one row, toggle beside the divider. Collapsed: a column, toggle under the symbol. */}
      <SidebarHeader className="group-data-[collapsible=icon]:px-4">
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
          <SidebarMenu className="min-w-0 flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="group-data-[collapsible=icon]:justify-center">
                <Link href="/c">
                  <Logo className="size-6" />
                  <span className="text-[17px] font-bold tracking-[-0.02em] text-foreground group-data-[collapsible=icon]:hidden">
                    Clippifi
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger
            title="Collapse or expand the sidebar (Ctrl+B)"
            className="size-9 shrink-0 rounded-xl text-muted-foreground hover:bg-sidebar-accent/55 hover:text-foreground group-data-[collapsible=icon]:size-10 [&_svg]:size-5"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {creatorNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href, pathname)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:justify-center">
                  <UserAvatar user={user} className="size-8" />
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium text-foreground">{user.name || "Your account"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/c/settings">
                    <Settings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={signOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
