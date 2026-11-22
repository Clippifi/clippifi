import { AppSidebar } from "@/components/app/app-sidebar";
import { MobileTabBar } from "@/components/app/mobile-tab-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireSession } from "@/server/session";

export default async function AppLayout({ children }: LayoutProps<"/c">) {
  const { user } = await requireSession();

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: user.name, email: user.email, image: user.image }} />
      <SidebarInset className="min-w-0">
        {/* Bottom padding on phones leaves room for the floating tab bar. Every page uses the
            same full width (DESIGN.md → Page width); forms cap their own column inside it. */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 px-4 pt-4 pb-28 md:px-8 md:pt-8 md:pb-10">{children}</div>
        <MobileTabBar />
      </SidebarInset>
    </SidebarProvider>
  );
}
