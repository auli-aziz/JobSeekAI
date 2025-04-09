"use client";
import Link from "next/link";
import Button from "./Button";
import ThemeSwitch from "./ThemeSwitch";
import { FaSignInAlt } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";

export const Header = () => {
  return (
    <header className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center">
          <FaUserTie className="text-3xl" />
        </div>
        <strong className="text-primary text-lg select-none">AIJobFind</strong>
      </div>

      <div className="flex items-center gap-5">
        <nav className="flex gap-5">
          <a href="">About</a>
          <a href="">Jobs</a>
          <a href="">Profile</a>
        </nav>
        <div className="mx-10 flex items-center gap-3">
          <ThemeSwitch />
          <Link
            href={"/"}
            type="button"
            className="rounded px-2 py-2 text-sm bg-button-secondary text-secondary ring-secondary ring-2 text-destructive inline-flex w-fit min-w-[95px] items-center justify-between gap-3"
          >
            <span className="ml-2">Sign In</span>
            <FaSignInAlt />
          </Link>
        </div>
      </div>
    </header>
  );
};
