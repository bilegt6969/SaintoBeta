"use client";

import { onAuthStateChanged } from "firebase/auth";
import { establishAuthSession, signOutSession } from "app/actions/auth";
import { auth } from "lib/firebase";
import { useEffect } from "react";

export function AuthSessionSync() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          await establishAuthSession(token);
        } else {
          await signOutSession();
        }
      } catch (error) {
        console.error("Failed to sync auth session:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
