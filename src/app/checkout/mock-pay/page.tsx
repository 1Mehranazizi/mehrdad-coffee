import { Suspense } from "react";
import MockPayClient from "@/components/checkout/MockPayClient";

export default function MockPayPage() {
  return (
    <Suspense>
      <MockPayClient />
    </Suspense>
  );
}
