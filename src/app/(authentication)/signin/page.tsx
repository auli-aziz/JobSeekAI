"use client";

import Button from "~/components/button";
import Link from "next/link";
import {
  GoogleSignInButton,
  LinkedInSignInButton,
} from "~/components/auth-button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const inputClass =
    "h-12 w-full rounded-md border border-gray-800 bg-background px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col lg:flex-row">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="via-secondary bg-span-bg h-full w-full overflow-hidden rounded-[40px]">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">Welcome Back!</h2>
            <p className="mb-12 text-lg">Great to have you back on board.</p>
            <div className="w-full max-w-sm space-y-4">
              {[
                "Enter your credentials",
                "Continue finding jobs with AI",
                "Track your applications",
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
            <div className="mb-8 grid gap-4">
              <GoogleSignInButton callback="/dashboard" />
              <LinkedInSignInButton callback="/dashboard" />
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background text-secondary px-2">Or</span>
              </div>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@flowersandsaints.com.au"
                className={inputClass}
              />
              <label>Password</label>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="YourBestPassword"
                  className={inputClass}
                />
                <p className="text-secondary mt-1 text-sm">
                  Must be at least 8 characters.
                </p>
              </div>
              <Button className="h-12 w-full hover:cursor-pointer">
                Sign In
              </Button>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

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
