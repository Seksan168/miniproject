"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to homepage when unauthenticated
    }

    // When authenticated and session exists, store user details in localStorage
    if (status === "authenticated" && session?.user?.id) {
      localStorage.setItem("userId", session.user.id);
      localStorage.setItem("userName", session.user.name);
    }

    // Cleanup: Remove user details from localStorage when session changes or on logout
    return () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    };
  }, [status, session, router]);

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
    // Optionally, clear localStorage immediately after sign-out
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  // When after loading success and have session, show profile
  return (
    status === "authenticated" &&
    session.user && (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p>
            Welcome, <b>{session.user.name}!</b>
          </p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
          <p>ID: {session.user.id}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}
