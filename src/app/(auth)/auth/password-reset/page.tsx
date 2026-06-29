"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { toast } from "@/store/useToastStore";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success("Password reset instructions sent to your email!");
    }, 1200);
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded flex items-center justify-center">
              <Building2 className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">waveron</span>
          </Link>
        </div>
        
        <h2 className="text-center text-xl font-semibold text-foreground mb-2">Reset Password</h2>
        <p className="text-center text-sm text-muted-foreground mb-8">
          {isSent 
            ? "Check your email for instructions to reset your password."
            : "Enter your email address to retrieve your password."}
        </p>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                placeholder="name@agency.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Sending instructions..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center text-sm text-success font-medium">
              📩 We have emailed a password reset link to <span className="font-bold">{email}</span>. Please click the link to configure a new password.
            </div>
            
            <button
              onClick={() => setIsSent(false)}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-semibold border border-border bg-card text-foreground hover:bg-muted h-9 px-4 py-2 mt-2 cursor-pointer"
            >
              Resend Password Link
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/auth/signin" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
