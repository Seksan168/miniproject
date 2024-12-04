"use client";

import { signOut } from "next-auth/react";

export default function Head() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex gap-x-12 px-52">
          <a
            href="/management"
            className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Features
          </a>
          <a
            href="/maketplace"
            className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Marketplace
          </a>
          <a
            href="/cart"
            className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Cart
          </a>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-4 ml-auto">
            <img
              src={"https://cdn-icons-png.flaticon.com/512/6596/6596121.png"} // Fallback to a default avatar if no image
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover border-2 border-indigo-600"
            />
            <span className="font-semibold text-gray-900">{userName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex ml-auto">
            <a
              href="/login"
              className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
