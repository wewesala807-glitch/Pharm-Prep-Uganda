import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge, PremiumBadge } from "@/components/ui/badge";
import { PlanActionButton } from "@/components/admin/plan-action-button";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark">Users</h1>
      <p className="mt-1 font-ui text-sm text-muted">{users.length} registered users</p>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left font-ui text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 font-semibold text-dark">Name</th>
              <th className="p-4 font-semibold text-dark">Email</th>
              <th className="p-4 font-semibold text-dark">Role</th>
              <th className="p-4 font-semibold text-dark">Plan</th>
              <th className="p-4 font-semibold text-dark">Joined</th>
              <th className="p-4 font-semibold text-dark">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-4 text-dark">{u.name}</td>
                <td className="p-4 text-muted">{u.email}</td>
                <td className="p-4">
                  <Badge tone="neutral">{u.role}</Badge>
                </td>
                <td className="p-4">
                  {u.plan === "PREMIUM" ? <PremiumBadge /> : <Badge tone="neutral">Free</Badge>}
                </td>
                <td className="p-4 text-muted">{u.createdAt.toLocaleDateString()}</td>
                <td className="p-4">
                  <PlanActionButton userId={u.id} plan={u.plan} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
