'use client'

import Button from '~/components/Button'
import Link from 'next/link'

export default function SignUpPage() {
  const inputClass =
    'h-12 w-full rounded-md border border-gray-800 bg-background px-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background text-primary">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-span-bg">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">Complete these easy steps to register your account.</p>

            <div className="w-full max-w-sm space-y-4">
              {["Sign up your account", "Set up your workspace", "Set up your profile"].map((step, index) => (
                <div key={index} className={`rounded-lg p-4 backdrop-blur-sm ${index === 0 ? "bg-white/10" : "bg-white/5"}`}>
                  <div className="flex items-center gap-4">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${index === 0 ? "bg-white text-black" : "bg-white/20 text-white"}`}>
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
            <p className="mb-8 text-secondary">Enter your personal data to create your account.</p>

            <div className="mb-8 grid gap-4">
              <Button className="h-12 w-full">Google</Button>
              <Button className="h-12 w-full">GitHub</Button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-secondary">Or</span>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input type="text" placeholder="Dollar" className={inputClass} />
                <input type="text" placeholder="Gill" className={inputClass} />
              </div>
              <input type="email" placeholder="example@flowersandsaints.com.au" className={inputClass} />
              <div>
                <input type="password" placeholder="YourBestPassword" className={inputClass} />
                <p className="mt-1 text-sm text-secondary">Must be at least 8 characters.</p>
              </div>
              <Button className="h-12 w-full">Sign Up</Button>

              <p className="text-center text-sm text-secondary">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
