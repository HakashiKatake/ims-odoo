import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join StockMaster Inventory Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
        />
      </div>

      <div className="mt-6 text-center">
        <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-purple-800 font-medium mb-2">
            After signing up, select your role:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-purple-700 mt-3">
            <div className="bg-white p-2 rounded border border-purple-100">
              <div className="font-semibold">👤 Admin</div>
              <div>Full system access</div>
            </div>
            <div className="bg-white p-2 rounded border border-purple-100">
              <div className="font-semibold">👥 Staff</div>
              <div>View-only access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
