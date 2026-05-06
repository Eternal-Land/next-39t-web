import Link from "next/link";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#posts", label: "Posts" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">39</span>
          </div>
          <span className="font-semibold">39T</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div></div>
      </div>
    </header>
  );
}
