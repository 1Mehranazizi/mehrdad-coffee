"use client";

import { useEffect, useState } from "react";

type MeResponse = { loggedIn: boolean; phone?: string; name?: string | null };

export function useCustomerSession() {
  const [state, setState] = useState<MeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setState(data);
      })
      .catch(() => {
        if (!cancelled) setState({ loggedIn: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state; // null while loading
}
