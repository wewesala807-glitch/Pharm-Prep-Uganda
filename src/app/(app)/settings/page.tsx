"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PremiumBadge, Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus({ type: "error", message: data.error ?? "Something went wrong" });
      return;
    }

    setStatus({ type: "success", message: "Profile updated successfully" });
    setCurrentPassword("");
    setNewPassword("");
    update();
  }

  const isPremium = session?.user?.plan === "PREMIUM";

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-dark">Settings</h1>

      <Card className="mt-6 flex items-center justify-between p-6">
        <div>
          <p className="font-ui text-xs uppercase tracking-wide text-muted">Current plan</p>
          <p className="mt-1 font-heading text-lg font-semibold text-dark">
            {isPremium ? "Premium" : "Free"}
          </p>
        </div>
        {isPremium ? <PremiumBadge /> : <Badge tone="neutral">Free plan</Badge>}
      </Card>

      {!isPremium && (
        <Card className="mt-4 p-6">
          <p className="font-ui text-sm text-dark">
            Upgrade to Premium for full notes, the complete question bank, and 100-question mock exams.
          </p>
          <p className="mt-2 font-ui text-xs text-muted">
            Payment checkout (MTN Mobile Money, Airtel Money, card) is wired up in the next build phase.
          </p>
          <Button className="mt-4" variant="premium" disabled>
            Upgrade to Premium — coming next
          </Button>
        </Card>
      )}

      <Card className="mt-6 p-6">
        <h2 className="font-heading text-lg font-semibold text-dark">Profile</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="border-t border-border pt-4">
            <p className="mb-3 font-ui text-sm font-semibold text-dark">Change password</p>
            <div className="space-y-3">
              <Field
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
              <Field
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          {status && (
            <p className={`font-ui text-sm ${status.type === "success" ? "text-accentGreen" : "text-hard"}`}>
              {status.message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
