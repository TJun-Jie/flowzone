"use client";
import { ClerkLoaded, SignInButton, useUser } from "@clerk/nextjs";

import { useEffect } from "react";

import Home from "./home/page";

export default function HomePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-4 from-pink-300 via-purple-300 to-indigo-400">
      {user ? (
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 ">
            Welcome back, {user.firstName}!
          </h1>
          <Home />
        </div>
      ) : (
        <div className="p-6 rounded-lg shadow-lg bg-white -mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome to Calendare
          </h2>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
          <ClerkLoaded>
            <div className="flex justify-center text-white bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded ">
              <SignInButton />
            </div>
          </ClerkLoaded>
        </div>
      )}
    </div>
  );
}
