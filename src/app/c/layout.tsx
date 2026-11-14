import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireSession } from "@/server/session";

export default async function AppLayout({ children }: LayoutProps<"/c">) {
  const { user } = await requireSession();

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: user.name, email: user.email, image: user.image }} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
