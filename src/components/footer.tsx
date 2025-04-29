import { Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary py-20 max-lg:py-10 border-t border-border-secondary">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-6">
          <h3 className="flex items-center text-xl font-bold mb-2">
            <Briefcase className="text-primary mr-2 h-6 w-6" />
            WorkWiz
          </h3>
          <p className="text-sm text-slate-500">
            Your intelligent job-matching platform
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/jobs" className="hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        {/* Optional: Add social media icons here if needed */}

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} WorkWiz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
