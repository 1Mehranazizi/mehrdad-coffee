import { getCurrentCustomer } from "@/server/auth/customer";
import ProfileForm from "@/components/account/ProfileForm";

export default async function AccountProfilePage() {
  const customer = await getCurrentCustomer();

  return (
    <div className="max-w-md">
      <h2 className="font-bold text-ink mb-4">اطلاعات پروفایل</h2>
      <ProfileForm initialName={customer?.name ?? ""} />
    </div>
  );
}
