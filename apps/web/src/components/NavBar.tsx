"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/goals", label: "Goals" },
  { href: "/mocks", label: "Mocks" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        GOALYST
      </Link>
      <nav className="nav-links">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname.startsWith(link.href) ? "nav-link active" : "nav-link"}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
