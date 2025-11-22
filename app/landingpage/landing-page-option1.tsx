"use client"

import React from 'react'
import { useRouter } from "next/navigation"
import { useUser } from '@clerk/nextjs'
import { FeaturesSection } from "./features-section"
import { Footer } from "./footer"

export function LandingPageOption1() {
    const router = useRouter()
    const { user, isSignedIn } = useUser()

    const handleAdminAccess = () => {
        if (isSignedIn) {
            // Set role and redirect to dashboard
            user?.update({
                unsafeMetadata: { role: 'admin' }
            }).then(() => {
                router.push('/dashboard')
            })
        } else {
            router.push("/sign-in")
        }
    }

    const handleStaffAccess = () => {
        if (isSignedIn) {
            // Set role and redirect to dashboard
            user?.update({
                unsafeMetadata: { role: 'staff' }
            }).then(() => {
                router.push('/dashboard')
            })
        } else {
            router.push("/sign-in")
        }
    }

    const handleAuth = (type: 'login' | 'signup') => {
        router.push(type === 'login' ? "/sign-in" : "/sign-up")
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-cyan-300 rounded-full" />
                    </div>
                    <span className="text-xl font-bold tracking-wider">INVENTORY</span>
                </div>
                <div className="flex items-center gap-4">
                    {isSignedIn ? (
                        // Show user welcome message and dashboard button for authenticated users
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-white/80">
                                Welcome, {user?.firstName || 'User'}!
                            </span>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-6 py-2 text-sm font-light tracking-widest text-white relative rounded-lg transition-all duration-300 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-0 animate-shimmer" />
                                <div className="absolute inset-0 rounded-lg p-px bg-linear-to-r from-cyan-400/50 via-blue-400/30 to-cyan-400/50 group-hover:opacity-0 opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-px bg-black rounded-lg" />
                                </div>
                                <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">DASHBOARD</span>
                            </button>
                        </div>
                    ) : (
                        // Show login/signup buttons for non-authenticated users
                        <>
                            <button
                                onClick={() => handleAuth('login')}
                                className="px-6 py-2 text-sm font-light tracking-widest text-white relative rounded-lg transition-all duration-300 overflow-hidden group"
                            >
                                {/* Gradient border background */}
                                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-0 animate-shimmer" />

                                {/* Static gradient border when not hovered */}
                                <div className="absolute inset-0 rounded-lg p-px bg-linear-to-r from-cyan-400/50 via-blue-400/30 to-cyan-400/50 group-hover:opacity-0 opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-px bg-black rounded-lg" />
                                </div>

                                {/* Blue background on hover */}
                                <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Text */}
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">LOGIN</span>
                            </button>

                            <button
                                onClick={() => handleAuth('signup')}
                                className="px-6 py-2 text-sm font-bold tracking-widest text-black relative rounded-lg transition-all duration-300 overflow-hidden group"
                            >
                                {/* Gradient border background */}
                                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-0 animate-shimmer" />

                                {/* Static gradient border when not hovered */}
                                <div className="absolute inset-0 rounded-lg p-px bg-linear-to-r from-cyan-400/50 via-blue-400/30 to-cyan-400/50 group-hover:opacity-0 opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-px bg-cyan-400 rounded-lg" />
                                </div>

                                {/* Blue background on hover */}
                                <div className="absolute inset-0 bg-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Text */}
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">SIGN UP</span>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <main className="grid grid-cols-2 gap-8 px-12 py-20 flex-1">
                {/* Admin Section - Cyan/Blue Theme */}
                <div className="relative group rounded-3xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 h-full">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-cyan-900/20 via-blue-900/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.1),transparent_50%)]" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-16 z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 w-fit mb-8">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                            <span className="text-xs font-light tracking-widest text-cyan-300">ADMIN ACCESS</span>
                        </div>

                        {/* Title and Description */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-6xl font-black tracking-tighter mb-6 text-balance">ADMIN</h2>
                                <p className="text-cyan-200/70 text-sm leading-relaxed max-w-xs">
                                    Full control over inventory, analytics, user management, and system configurations
                                </p>
                            </div>

                            {/* Neon accent line */}
                            <div className="w-24 h-1 bg-linear-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50" />

                            {/* Button */}
                            <button
                                onClick={handleAdminAccess}
                                className="w-fit px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95"
                            >
                                {isSignedIn ? "START AS ADMIN" : "SIGN IN AS ADMIN"}
                            </button>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-3 text-xs text-cyan-200/60 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full shrink-0" />
                                <span>Real-time Dashboard</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full shrink-0" />
                                <span>Advanced Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-cyan-400 rounded-full shrink-0" />
                                <span>User Management</span>
                            </div>
                        </div>
                    </div>

                    {/* Accent corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-400/30" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-400/30" />
                </div>

                {/* Staff Section - Orange/Red Theme */}
                <div className="relative group rounded-3xl overflow-hidden border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 h-full">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-orange-900/20 via-red-900/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(251,146,60,0.1),transparent_50%)]" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-16 z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 w-fit mb-8">
                            <div className="w-2 h-2 bg-orange-400 rounded-full" />
                            <span className="text-xs font-light tracking-widest text-orange-300">STAFF ACCESS</span>
                        </div>

                        {/* Title and Description */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-6xl font-black tracking-tighter mb-6 text-balance">STAFF</h2>
                                <p className="text-orange-200/70 text-sm leading-relaxed max-w-xs">
                                    Manage daily operations, track stock levels, and process inventory updates
                                </p>
                            </div>

                            {/* Neon accent line */}
                            <div className="w-24 h-1 bg-linear-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50" />

                            {/* Button */}
                            <button
                                onClick={handleStaffAccess}
                                className="w-fit px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 active:scale-95"
                            >
                                {isSignedIn ? "START AS STAFF" : "SIGN IN AS STAFF"}
                            </button>
                        </div>

                        {/* Feature List */}
                        <div className="space-y-3 text-xs text-orange-200/60 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-orange-400 rounded-full shrink-0" />
                                <span>Quick Stock Updates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-orange-400 rounded-full shrink-0" />
                                <span>Item Tracking</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-orange-400 rounded-full shrink-0" />
                                <span>Daily Reports</span>
                            </div>
                        </div>
                    </div>

                    {/* Accent corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-orange-400/30" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-400/30" />
                </div>
            </main>

            {/* Features Section */}
            <FeaturesSection />

            <Footer />
        </div>
    )
}
