import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to StockMaster
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inventory Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
          forceRedirectUrl="/landingpage"
          signUpUrl="/sign-up"
        />
      </div>

      <div className="mt-6 text-center">
        <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-blue-800 font-medium mb-2">
            After signing up, you'll be asked to select your role:
          </p>
          <div className="flex justify-center gap-4 text-xs text-blue-700">
            <span>👤 <strong>Admin:</strong> Full Access</span>
            <span>👥 <strong>Staff:</strong> View Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
