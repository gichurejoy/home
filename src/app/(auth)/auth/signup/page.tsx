import { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up | Lahomes",
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm overflow-hidden my-8">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded flex items-center justify-center">
              <Building2 className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">Lahomes</span>
          </Link>
        </div>
        
        <h2 className="text-center text-xl font-semibold text-foreground mb-2">Create an Account</h2>
        <p className="text-center text-sm text-muted-foreground mb-8">Sign up to get started with Lahomes.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Create a password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-input bg-transparent text-primary focus:ring-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              I accept the <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="button"
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
