import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex bg-paper">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <AdminMobileNav />
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
