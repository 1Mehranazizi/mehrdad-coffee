import { getCurrentCustomer } from "@/server/auth/customer";
import { getApplicationByCustomer } from "@/server/repo/partners";
import PartnerForm from "@/components/account/PartnerForm";

export const metadata = { title: "درخواست همکاری | قهوه مهرداد" };

export default async function PartnerPage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;
  const application = getApplicationByCustomer(customer.id) ?? null;

  return (
    <div>
      <h2 className="font-bold text-ink mb-4">همکاری (خرید عمده)</h2>
      <PartnerForm isPartner={customer.type === "partner"} application={application} />
    </div>
  );
}
