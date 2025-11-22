'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Shield, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SelectRolePage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
        },
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting role:', error);
      alert('Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user already has a role, redirect to dashboard
  if (user?.unsafeMetadata?.role) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-cyan-950/50 animate-pulse" style={{ animationDuration: '4s' }}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Sparkles className="h-10 w-10 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            Select Your <span className="text-cyan-400">Role</span>
          </h1>
          <p className="text-lg text-slate-400">
            Choose the role that best fits your responsibilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedRole === 'admin'
                ? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                : 'border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'
            } backdrop-blur-xl`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full transition-all ${
                  selectedRole === 'admin' 
                    ? 'bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                    : 'bg-slate-800'
                }`}>
                  <Shield className={`h-12 w-12 ${selectedRole === 'admin' ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-white">Admin</CardTitle>
              <CardDescription className="text-center text-base text-slate-400">
                Full access to all system features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 font-bold">✓</span>
                  <span>Manage products, warehouses, and locations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 font-bold">✓</span>
                  <span>Create and validate stock operations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 font-bold">✓</span>
                  <span>Perform stock adjustments and transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 font-bold">✓</span>
                  <span>Access all reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 font-bold">✓</span>
                  <span>Configure system settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              selectedRole === 'staff'
                ? 'border-indigo-500 bg-indigo-950/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]'
                : 'border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]'
            } backdrop-blur-xl`}
            onClick={() => setSelectedRole('staff')}
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full transition-all ${
                  selectedRole === 'staff' 
                    ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                    : 'bg-slate-800'
                }`}>
                  <Users className={`h-12 w-12 ${selectedRole === 'staff' ? 'text-indigo-400' : 'text-slate-500'}`} />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-white">Staff</CardTitle>
              <CardDescription className="text-center text-base text-slate-400">
                View-only access for monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">✓</span>
                  <span>View inventory levels and stock</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">✓</span>
                  <span>Track operation status and history</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">✓</span>
                  <span>Monitor stock movements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">✓</span>
                  <span>View reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400 font-bold">✗</span>
                  <span className="text-slate-500">Cannot modify stock or settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="px-12 text-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Continue'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {selectedRole && (
          <p className="text-center mt-6 text-sm text-slate-500">
            You can request a role change later from your administrator
          </p>
        )}
      </div>
    </div>
  );
}
