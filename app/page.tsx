import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Package, ArrowRight, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex min-h-screen flex-col justify-center py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Package className="h-20 w-20 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              StockMaster
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Modern Inventory Management System
            </p>
            <p className="mt-2 text-lg text-gray-500">
              Digitize and streamline all your stock-related operations
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 hover:border-blue-200 transition-all">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Package className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle>Real-time Stock Tracking</CardTitle>
                  <CardDescription>
                    Monitor inventory levels across multiple warehouses and locations in real-time
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-purple-200 transition-all">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Shield className="h-12 w-12 text-purple-600" />
                  </div>
                  <CardTitle>Role-based Access</CardTitle>
                  <CardDescription>
                    Admin and staff roles with granular permissions for secure operations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-all">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <CardTitle>Complete Operations</CardTitle>
                  <CardDescription>
                    Manage receipts, deliveries, transfers, and adjustments from one platform
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Role Selection Info */}
            <div className="mt-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Choose Your Role
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Admin</CardTitle>
                    <CardDescription className="text-blue-700">
                      Full access to all operations, stock changes, and system settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✓ Manage products & warehouses</li>
                      <li>✓ Stock adjustments & transfers</li>
                      <li>✓ View all reports & analytics</li>
                      <li>✓ User management</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-900">Staff</CardTitle>
                    <CardDescription className="text-purple-700">
                      View-only access for day-to-day operations monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li>✓ View inventory levels</li>
                      <li>✓ Track operations status</li>
                      <li>✓ Generate reports</li>
                      <li>✓ Monitor stock movements</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

