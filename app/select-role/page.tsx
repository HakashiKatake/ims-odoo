'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Shield, Users, ArrowRight } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Select Your Role
          </h1>
          <p className="text-lg text-gray-600">
            Choose the role that best fits your responsibilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'admin'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${selectedRole === 'admin' ? 'bg-blue-200' : 'bg-gray-100'}`}>
                  <Shield className={`h-12 w-12 ${selectedRole === 'admin' ? 'text-blue-700' : 'text-gray-600'}`} />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Admin</CardTitle>
              <CardDescription className="text-center text-base">
                Full access to all system features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Manage products, warehouses, and locations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Create and validate stock operations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Perform stock adjustments and transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Access all reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Configure system settings</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all border-2 ${
              selectedRole === 'staff'
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('staff')}
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${selectedRole === 'staff' ? 'bg-purple-200' : 'bg-gray-100'}`}>
                  <Users className={`h-12 w-12 ${selectedRole === 'staff' ? 'text-purple-700' : 'text-gray-600'}`} />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Staff</CardTitle>
              <CardDescription className="text-center text-base">
                View-only access for monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>View inventory levels and stock</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Track operation status and history</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Monitor stock movements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>View reports and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-500">✗</span>
                  <span className="text-gray-500">Cannot modify stock or settings</span>
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
            className="px-12 text-lg"
          >
            {loading ? 'Setting up...' : 'Continue'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {selectedRole && (
          <p className="text-center mt-6 text-sm text-gray-500">
            You can request a role change later from your administrator
          </p>
        )}
      </div>
    </div>
  );
}
