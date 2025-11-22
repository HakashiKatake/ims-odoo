import { Navbar } from '@/components/navbar';
import { AIChatbot } from '@/components/ai-chatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <Navbar />
      <main>{children}</main>
      <AIChatbot />
    </div>
  );
}
