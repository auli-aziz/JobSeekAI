"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { useSession } from "next-auth/react";
import { SignOutButton } from "./AuthButton";
import { FaUserTie } from "react-icons/fa6";
import { FaSignInAlt } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="relative mx-auto flex max-w-screen-2xl items-center justify-between p-5">
      {/* Logo */}
      <Link href={"/"}>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center">
            <FaUserTie className="text-3xl" />
          </div>
          <strong className="text-primary text-lg select-none">
            JobSeekAI
          </strong>
        </div>
      </Link>

      {/* Desktop Actions + Navigation */}
      <div className="hidden items-center gap-5 md:flex">
        {/* Desktop Navigation (now beside ThemeSwitch) */}
        <nav className="mr-10 flex items-center gap-5">
          <Link href="">About</Link>
          <Link href="">Jobs</Link>
          <Link href="">Profile</Link>
        </nav>

        <ThemeSwitch />
        {session ? (
          <SignOutButton />
        ) : (
          <Link
            href="/signin"
            className="bg-button-secondary text-secondary ring-secondary inline-flex h-[34.5px] w-fit min-w-[95px] items-center justify-between gap-3 rounded px-2 py-2 text-sm ring-2"
          >
            <span className="ml-2">Sign In</span>
            <FaSignInAlt />
          </Link>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <ThemeSwitch />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-primary text-2xl"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-background-secondary absolute top-20 right-5 z-50 flex w-48 flex-col gap-4 rounded-md p-4 text-sm shadow-md md:hidden">
          <a href="">About</a>
          <a href="">Jobs</a>
          <a href="">Profile</a>
          {session ? (
            <SignOutButton />
          ) : (
            <Link
              href="/signin"
              className="bg-button-secondary text-secondary ring-secondary text-destructive inline-flex h-[34.5px] w-fit min-w-[95px] items-center justify-between gap-3 rounded px-2 py-2 text-sm ring-2"
            >
              <span className="ml-2">Sign In</span>
              <FaSignInAlt />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
