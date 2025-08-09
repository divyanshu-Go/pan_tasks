"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import CreateAndProfile from "./CreateAndProfile";
import axios from "axios";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ user, open, setOpen, toggleRef }) {
  const pathname = usePathname();
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen, toggleRef]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href) => pathname === `/${href}`;

  return (
    <aside
      ref={sidebarRef}
      className={`flex flex-col justify-between h-[calc(100%-4rem)] blurred-bg fixed top-[3.3rem] left-0 w-64 rounded
         bg-orange-50 shadow-md z-40 transform transition-transform duration-150 ease-in-out border border-orange-500 
         ${open ? "translate-x-1" : "-translate-x-full"}`}
    >
      {/* Top - Navigation */}
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-orange-700">Elements</h2>
        {/* Example active state styling for links */}
        <nav className="flex flex-col gap-2">
          <a
            href="/elements"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("elements")
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "text-orange-500 hover:bg-orange-200 hover:text-orange-700"
            }`}
          >
            Elements Home
          </a>
        </nav>
      </div>

      {/* Bottom - Actions & Logout */}
      <div className="p-4 flex items-center gap-4 border-t border-orange-100">
        {user ? (
          <button
            className="flex items-center bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        ):
        (
          <Link
            className="flex items-center bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            href='/login'
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
        )
        }
        <CreateAndProfile user={user} />
      </div>
    </aside>
  );
}
