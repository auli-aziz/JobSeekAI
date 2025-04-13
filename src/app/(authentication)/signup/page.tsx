"use client";

import Button from "~/components/Button";
import Link from "next/link";
import { GoogleSignInButton, LinkedInSignInButton } from "~/components/AuthButton";

export default function SignUpPage() {

  const inputClass =
    "h-12 w-full rounded-md border border-gray-800 bg-background px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col lg:flex-row">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="via-secondary h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-[#097fa5] to-transparent">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">
              Complete these easy steps to register your account.
            </p>

            <div className="w-full max-w-sm space-y-4">
              {[
                "Sign up your account",
                "Set up your profile",
                "Start finding jobs using AI",
              ].map((step, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 backdrop-blur-sm ${index === 0 ? "bg-white/10" : "bg-white/5"}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${index === 0 ? "bg-white text-black" : "bg-white/20 text-white"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-lg">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold">Sign Up Account</h2>
            <p className="text-secondary mb-8">
              Enter your personal data to create your account.
            </p>

            <div className="mb-8 grid gap-4">
              <GoogleSignInButton callback="/profile" />
              <LinkedInSignInButton callback="/profile" />
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
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Dollar"
                  className={inputClass}
                />
                <input type="text" placeholder="Gill" className={inputClass} />
              </div>
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
              <Button className="h-12 w-full">Sign Up</Button>

              <p className="text-secondary text-center text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
