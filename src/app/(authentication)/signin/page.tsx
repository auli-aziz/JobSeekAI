"use client";

import Button from "~/components/Button";
import Link from "next/link";
import { FaGoogle, FaLinkedinIn   } from "react-icons/fa";

export default function SignInPage() {
  const inputClass =
    "h-12 w-full rounded-md border border-gray-800 bg-background px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col lg:flex-row">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="via-secondary h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-[#097fa5] to-transparent">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">Welcome Back!</h2>
            <p className="mb-12 text-lg">
              Great to have you back on board.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold">Sign In Account</h2>
            <p className="text-secondary mb-8">
              Enter your credential to access your account.
            </p>

            <div className="mb-8 grid gap-4">
              <Button className="h-12 w-full flex items-center justify-center gap-3">
                <FaGoogle className="h-[20px] w-[20px]" />
                Google
              </Button>
              <Button className="h-12 w-full flex items-center justify-center gap-3">
                <FaLinkedinIn  className="h-[20px] w-[20px]" />
                LinkedIn
              </Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background text-secondary px-2">Or</span>
              </div>
            </div>

            <form className="space-y-6">
              <input
                type="email"
                placeholder="example@flowersandsaints.com.au"
                className={inputClass}
              />
              <div>
                <input
                  type="password"
                  placeholder="YourBestPassword"
                  className={inputClass}
                />
                <p className="text-secondary mt-1 text-sm">
                  Must be at least 8 characters.
                </p>
              </div>
              <Button className="h-12 w-full">Sign In</Button>

              <p className="text-secondary text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
