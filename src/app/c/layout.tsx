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
        {/* Bottom padding on phones leaves room for the floating tab bar. Pages are centred
            for comfortable reading; a page can opt out with [data-page-width]: wide (campaign page) or full (Discover). */}
        <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-1 has-[[data-page-width=wide]]:max-w-6xl has-[[data-page-width=full]]:max-w-none flex-col gap-6 px-4 pt-4 pb-28 md:px-8 md:pt-8 md:pb-10">{children}</div>
        <MobileTabBar />
      </SidebarInset>
    </SidebarProvider>
  );
}
