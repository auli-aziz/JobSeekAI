"use client";

import { signIn, signOut } from "next-auth/react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import Button from "./Button";

export function GoogleSignInButton({
  callback,
}: {
  callback: string;
}) {
  const handleClick = async () => {
    await signIn("google", { callbackUrl: `${callback}` });
  };

  return (
    <Button
      onClick={handleClick}
      className="flex h-12 w-full items-center justify-center gap-3 hover:cursor-pointer"
    >
      <FaGoogle className="h-[20px] w-[20px]" />
      <span className="ml-4">Google</span>
    </Button>
  );
}

export function LinkedInSignInButton({
  callback,
}: {
  callback: string;
}) {
  const handleClick = async () => {
    await signIn("linkedin", { callbackUrl: `${callback}` });
  };

  return (
    <Button
      onClick={handleClick}
      className="flex h-12 w-full items-center justify-center gap-3 hover:cursor-pointer"
    >
      <FaLinkedinIn className="h-[20px] w-[20px]" />
      <span className="ml-4">Linkedin</span>
    </Button>
  );
}

export function CredentialsSignInButton() {
  const handleClick = async () => {
    await signIn();
  };

  return (
    <Button className="h-12 w-full" onClick={handleClick}>
      <span className="ml-4">Continue with Email</span>
    </Button>
  );
}

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <form action={handleSignOut} className="w-full">
      <button type="submit" className="flex w-full">
        <div className="bg-button-secondary text-secondary ring-secondary text-destructive inline-flex h-[34.5px] w-fit min-w-[95px] items-center justify-between gap-3 rounded px-2 py-2 text-sm ring-2 hover:cursor-pointer">
          <span>Sign out</span>
          <IoLogOutOutline className="h-4 w-4" />
        </div>
      </button>
    </form>
  );
}
