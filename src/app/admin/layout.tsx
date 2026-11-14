// Old Firebase-era screens, kept until each is rebuilt in the new app (/c).
import { AuthProvider } from "@/lib/auth/auth-context";
import RequireAuth from "@/components/dashboard/RequireAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <RequireAuth area="admin">
        <DashboardShell area="admin">{children}</DashboardShell>
      </RequireAuth>
    </AuthProvider>
  );
}
