import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const rows: { label: string; free: boolean; premium: boolean }[] = [
  { label: "Access to 1 topic per subject", free: true, premium: true },
  { label: "All video lessons", free: true, premium: true },
  { label: "5 free questions per topic", free: true, premium: true },
  { label: "Full notes for every topic", free: false, premium: true },
  { label: "All 3,600+ practice questions", free: false, premium: true },
  { label: "Full 100-question mock exams", free: false, premium: true },
  { label: "Downloadable PDF notes", free: false, premium: true },
  { label: "Weekly leaderboard", free: false, premium: true },
  { label: "Progress analytics by subject", free: false, premium: true },
];

const PRICES = [
  { months: 1, price: 25000 },
  { months: 3, price: 65000 },
  { months: 6, price: 120000 },
  { months: 12, price: 220000 },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-bg py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-dark md:text-4xl">
            Simple, exam-focused pricing
          </h2>
          <p className="mt-3 font-ui text-muted">
            Premium starts at UGX {PRICES[0].price.toLocaleString()}/month via MTN Mobile Money,
            Airtel Money, or card.
          </p>
        </div>

        <Card className="mt-10 overflow-hidden">
          <table className="w-full text-left font-ui text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 font-semibold text-dark">What&apos;s included</th>
                <th className="p-4 text-center font-semibold text-dark">Free</th>
                <th className="p-4 text-center font-semibold text-premium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="p-4 text-dark">{row.label}</td>
                  <td className="p-4 text-center">
                    {row.free ? (
                      <Check className="mx-auto h-4 w-4 text-accentGreen" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {row.premium ? (
                      <Check className="mx-auto h-4 w-4 text-premium" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {PRICES.map((p) => (
            <Card key={p.months} className="p-5 text-center">
              <div className="font-ui text-sm text-muted">
                {p.months} month{p.months > 1 ? "s" : ""}
              </div>
              <div className="mt-1 font-heading text-xl font-bold text-dark">
                UGX {p.price.toLocaleString()}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/register">
            <Button size="lg" variant="premium">
              Upgrade to Premium
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
