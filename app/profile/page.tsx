"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to homepage when unauthenticated
    }

    // When authenticated and session exists, store user details in localStorage
    if (status === "authenticated" && session?.user?.id) {
      setIsLoggedIn(true); // Track login state for UI
      localStorage.setItem("isLoggedIn", "true"); // Store login state
      localStorage.setItem("userId", session.user.id);
      localStorage.setItem("userName", session.user.name);
    }

    // Cleanup: Remove user details from localStorage when session changes or on logout
    return () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("isLoggedIn");
    };
  }, [status, session, router]);

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
    // Optionally, clear localStorage immediately after sign-out
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  // When authenticated, show profile
  if (status === "loading") {
    return <p>Loading...</p>; // Show loading message during authentication status check
  }

  return (
    status === "authenticated" &&
    session.user && (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Welcome, <span className="text-blue-600">{session.user.name}!</span>
          </h2>
          <p className="text-gray-600 text-center">Your account details:</p>

          <div className="space-y-2">
            <p className="text-gray-800">
              <strong>Email:</strong> {session.user.email}
            </p>
            <p className="text-gray-800">
              <strong>Role:</strong> {session.user.role}
            </p>
            <p className="text-gray-800">
              <strong>ID:</strong> {session.user.id}
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/maketplace"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Go to Marketplace
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-center bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  );
}
