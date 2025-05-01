"use client";
import { capitalize } from "~/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { FiSun } from "react-icons/fi";
import Button from "./button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, themes, theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) {
    return (
      <Button
        size="small"
        type="button"
        className="text-destructive inline-flex w-fit min-w-[95px] items-center justify-between gap-3"
        id="options-menu"
        aria-expanded={isOpen}
      >
        <span className="ml-2">Theme</span>
        <FiSun />
      </Button>
    );
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={ref} className="relative inline-block text-left">
      <Button
        size="small"
        type="button"
        className="text-destructive inline-flex w-full min-w-[95px] items-center justify-between gap-3"
        id="options-menu"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <span className="ml-2">Theme</span>
        <FiSun />
      </Button>
      {isOpen && (
        <div className="bg-dropdown absolute right-0 mt-2 w-full origin-top-right rounded-md shadow-lg z-20">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {themes.map((themeItem) => (
              <button
                key={themeItem}
                onClick={() => {
                  setTheme(themeItem);
                  setIsOpen(false);
                }}
                className={`hover:bg-dropdownHover block w-full px-4 py-2 text-left text-sm ${themeItem === theme
                  ? "bg-selected text-primary hover:bg-selected"
                  : "text-secondary"
                  }`}
              >
                {capitalize(themeItem)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
