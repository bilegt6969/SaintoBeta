"use client";

import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { cn } from "lib/cn";
import { auth } from "lib/firebase"; // Adjust this import path to match your project setup
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SignInButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Loading State: Prevents the button from flashing "Sign In"
  // while Firebase checks if the user is logged in.
  if (loading) {
    return (
      <div
        className={cn(
          "h-9 w-9 animate-pulse rounded-full bg-neutral-200",
          className,
        )}
      />
    );
  }

  // 2. Authenticated State: Show profile picture or fallback avatar icon
  if (user) {
    return (
      <Link
        href="/account" // Redirects to an account/profile page
        onClick={onClick}
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 overflow-hidden transition-opacity hover:opacity-90 active:scale-[0.98]",
          className,
        )}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User profile"}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer" // Fixes Google image loading restrictions
          />
        ) : (
          <User className="h-4 w-4 text-neutral-600" strokeWidth={2} />
        )}
      </Link>
    );
  }

  // 3. Unauthenticated State: Show original "Sign in" button
  return (
    <Link
      href="/sign-in"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.98]",
        className,
      )}
    >
      Sign in
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  );
}
