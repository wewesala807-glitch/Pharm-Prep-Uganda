import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 font-ui text-sm text-muted md:flex-row">
        <div className="font-heading font-bold text-dark">
          Pharma<span className="text-primary">Prep</span>
          <span className="text-accentGold"> UG</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#pricing" className="hover:text-primary">Pricing</a>
          <a href="#faq" className="hover:text-primary">FAQ</a>
          <Link href="/login" className="hover:text-primary">Log in</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} PharmaPrep Uganda</div>
      </div>
    </footer>
  );
}
