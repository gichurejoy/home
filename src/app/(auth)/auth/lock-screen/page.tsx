import { Metadata } from "next";
import Link from "next/link";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Lock Screen | Lahomes",
};

export default function LockScreenPage() {
  return (
    <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center border-4 border-background shadow-sm overflow-hidden">
             {/* Placeholder Avatar */}
             <div className="h-full w-full bg-primary/10 flex items-center justify-center">
               <User className="h-10 w-10 text-primary" />
             </div>
          </div>
        </div>
        
        <h2 className="text-center text-xl font-semibold text-foreground mb-1">Gaston</h2>
        <p className="text-center text-sm text-muted-foreground mb-8">Enter your password to unlock the screen!</p>

        <form className="space-y-4">
          <div>
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-center"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="button"
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4"
          >
            Unlock
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Not you? return{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
