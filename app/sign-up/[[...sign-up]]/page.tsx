import { SignUp } from '@clerk/nextjs';
import { Package, Sparkles, Zap } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-950 to-cyan-950/50 animate-pulse" style={{ animationDuration: '4s' }}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and branding */}
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500/10 p-4 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Package className="h-12 w-12 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-center text-4xl font-bold tracking-tight text-white mb-2">
          Join <span className="text-cyan-400">StockMaster</span>
        </h2>
        <p className="text-center text-sm text-slate-400 tracking-wide">
          Create your account to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <SignUp
          appearance={{
            baseTheme: undefined,
            layout: {
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            },
            variables: {
              colorPrimary: '#22d3ee',
              colorBackground: '#0f172a',
              colorInputBackground: '#1e293b',
              colorInputText: '#ffffff',
              colorText: '#ffffff',
              colorTextSecondary: '#94a3b8',
              colorDanger: '#ef4444',
              colorSuccess: '#10b981',
              colorWarning: '#f59e0b',
              borderRadius: '0.5rem',
              fontFamily: 'inherit',
            },
            elements: {
              rootBox: "mx-auto",
              card: "bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl",
              
              // Header
              headerTitle: "text-white text-2xl font-bold hidden",
              headerSubtitle: "text-slate-400 hidden",
              
              // Social buttons
              socialButtons: "flex flex-col gap-3",
              socialButtonsBlockButton: "bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 hover:border-cyan-500/50 text-white transition-all duration-200 rounded-lg",
              socialButtonsBlockButtonText: "text-white font-medium",
              socialButtonsBlockButtonArrow: "text-white",
              socialButtonsProviderIcon: "brightness-100",
              
              // Divider
              dividerLine: "bg-slate-700",
              dividerText: "text-slate-500 text-xs uppercase tracking-wider",
              
              // Form
              form: "space-y-4",
              formFieldLabel: "text-slate-300 font-medium text-sm mb-2",
              formFieldInput: "bg-slate-800/80 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-lg transition-all",
              formFieldInputShowPasswordButton: "text-slate-400 hover:text-cyan-400",
              
              // Buttons
              formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 rounded-lg py-3",
              formButtonReset: "text-cyan-400 hover:text-cyan-300",
              
              // Footer
              footer: "hidden",
              footerAction: "hidden",
              footerActionText: "text-slate-400",
              footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold",
              
              // Other elements
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
              formResendCodeLink: "text-cyan-400 hover:text-cyan-300",
              otpCodeFieldInput: "bg-slate-800 border-slate-700 text-white focus:border-cyan-500",
              
              // Alert
              alertText: "text-slate-300",
              
              // Internal card
              main: "bg-transparent",
              
              // Logo
              logoBox: "hidden",
              logoImage: "hidden",
            },
          }}
          forceRedirectUrl="/landingpage"
          signInUrl="/sign-in"
        />
      </div>

      <div className="mt-6 text-center relative z-10">
        <div className="px-6 py-4 bg-indigo-950/50 backdrop-blur-md border border-indigo-500/30 rounded-xl max-w-md mx-auto shadow-[0_0_30px_rgba(79,70,229,0.2)]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-cyan-400" />
            <p className="text-sm text-cyan-300 font-semibold tracking-wide">
              Welcome to StockMaster!
            </p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            After signing up, you'll explore our powerful inventory management features and select your role.
          </p>
        </div>
      </div>
    </div>
  );
}
