"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  Rocket,
} from "lucide-react";

const Page = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard/projects");
  };

  const features = [
    {
      icon: FolderKanban,
      title: "Organize Projects",
      description:
        "Keep all your projects neatly organized and easily accessible",
      color: "from-blue-500 to-cyan-500",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description:
        "Monitor real-time progress with beautiful analytics and insights",
      color: "from-green-500 to-emerald-500",
      bgColor:
        "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      icon: Users,
      title: "Collaborate Easily",
      description:
        "Work seamlessly with your team through integrated collaboration tools",
      color: "from-purple-500 to-pink-500",
      bgColor:
        "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Track & Manage Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Projects Efficiently
            </span>
            <div className="inline-block animate-bounce">🚀</div>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stay on top of every task, monitor progress, and collaborate
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {" "}
              seamlessly{" "}
            </span>
            with your team — all in one powerful platform.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shine" />
            <Rocket className="w-5 h-5 mr-3 group-hover:animate-bounce" />
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Card */}
              <div
                className={`relative h-full ${feature.bgColor} backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 transform group-hover:scale-105 transition-all duration-500 group-hover:shadow-2xl overflow-hidden`}
              >
                {/* Animated Background Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Icon Container */}
                <div
                  className={`inline-flex items-center justify-center p-4 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Decorative Elements */}
                <div
                  className={`absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div
                  className={`absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 delay-100`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
