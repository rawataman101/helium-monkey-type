import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function HomePage() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar />
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-indigo-600">TestType</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              TestType is a sleek, fast, and customizable typing test platform
              designed to help you improve your typing speed and accuracy. With
              a clean interface and minimal distractions, you can focus solely
              on your performance.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link to={"/signup"}>
                <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </button>
              </Link>

              <Link to={"/login"}>
                <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"
              alt="Developer Workspace"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
