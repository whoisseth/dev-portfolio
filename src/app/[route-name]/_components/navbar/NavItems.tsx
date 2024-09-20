import Link from "next/link";
import { navLinks } from ".";

export type NavLink = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

export function NavItems({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <>
      {navLinks.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          onClick={() => setIsOpen(false)}
        >
          <div className="text-sm">{link.icon}</div>
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );
}
