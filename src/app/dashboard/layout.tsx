// Old Firebase-era screens, kept until each is rebuilt in the new app (/c).
import { AuthProvider } from "@/lib/auth/auth-context";
import RequireAuth from "@/components/dashboard/RequireAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <RequireAuth area="account">
        <DashboardShell area="account">{children}</DashboardShell>
      </RequireAuth>
    </AuthProvider>
  );
}
