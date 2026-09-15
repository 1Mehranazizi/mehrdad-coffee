import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = { title: "ورود ادمین | قهوه مهرداد" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-cream p-8">
        <h1 className="text-xl font-extrabold text-ink text-center">
          ورود به پنل مدیریت
        </h1>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
