"use client";

import { establishAuthSession, signOutSession } from "app/actions/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebase";
import { useEffect } from "react";

export function AuthSessionSync() {
  useEffect(() => {
    if (!auth) return;

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
