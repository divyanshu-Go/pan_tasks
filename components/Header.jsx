"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateAndProfile from "./CreateAndProfile";
import HamburgerIcon from "./HamburgerIcon";

export default function Header({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Elements", href: "/elements" },
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="flex w-full fixed z-50 gap-1 px-1 pt-1">
      {/* Hamburger icon */}
      <div className="flex items-center" ref={toggleRef}>
        <HamburgerIcon open={open} setOpen={setOpen} />
      </div>

      {/* Navigation bar */}
      <div
        className="
        flex flex-grow items-center justify-between px-3
        blurred-bg bg-orange-50 text-orange-900 rounded border border-orange-500 
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span
            className="
              flex items-center gap-3 text-nowrap font-bold text-lg tracking-wider text-orange-600
            "
          >
            <img src="logo.png" alt="logo" width={26} />
            PanTasks
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-2 text-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`
                text-sm flex items-center text-center align-text-bottom font-medium py-1 px-4 rounded-lg tracking-widest ease-in-out delay-0 transition-colors duration-200
                ${
                  isActive(link.href)
                    ? "bg-orange-100 text-orange-600 border border-orange-200"
                    : "text-orange-500 hover:bg-orange-200 hover:text-orange-700"
                }
              `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <CreateAndProfile user={user} />
      </div>
    </header>
  );
}
