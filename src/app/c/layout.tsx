import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileTabBar } from "@/components/app/mobile-tab-bar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireSession } from "@/server/session";

export default async function AppLayout({ children }: LayoutProps<"/c">) {
  const { user } = await requireSession();

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: user.name, email: user.email, image: user.image }} />
      <SidebarInset>
        <header className="hidden h-14 shrink-0 items-center gap-2 px-4 md:flex">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        </header>
        {/* Bottom padding on phones leaves room for the floating tab bar. */}
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-4 pb-28 md:px-8 md:pt-0 md:pb-10">{children}</div>
        <MobileTabBar />
      </SidebarInset>
    </SidebarProvider>
  );
}
