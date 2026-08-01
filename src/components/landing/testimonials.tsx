import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Namutebi Patricia",
    role: "B.Pharm, Makerere University",
    quote:
      "The mock exams were almost identical in feel to the real licensing exam. I walked in already used to the pacing.",
  },
  {
    name: "Kato Emmanuel",
    role: "B.Pharm, Mbarara University",
    quote:
      "Pharmacokinetics never made sense to me until the video lessons here broke it down topic by topic.",
  },
  {
    name: "Achen Florence",
    role: "B.Pharm, Kampala International University",
    quote:
      "I studied on the bus using the offline notes. That alone was worth the premium subscription.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-dark md:text-4xl">
          Trusted by graduates across Uganda
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col justify-between p-6">
              <CardContent className="p-0">
                <p className="font-serif text-base italic text-dark">&ldquo;{t.quote}&rdquo;</p>
              </CardContent>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-ui text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-ui text-sm font-semibold text-dark">{t.name}</div>
                  <div className="font-ui text-xs text-muted">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
