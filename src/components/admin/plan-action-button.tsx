"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PlanActionButton({ userId, plan }: { userId: string; plan: "FREE" | "PREMIUM" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePlan() {
    setLoading(true);
    const newPlan = plan === "FREE" ? "PREMIUM" : "FREE";
    await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button
      size="sm"
      variant={plan === "FREE" ? "premium" : "outline"}
      disabled={loading}
      onClick={togglePlan}
    >
      {loading ? "Updating..." : plan === "FREE" ? "Upgrade" : "Downgrade"}
    </Button>
  );
}
