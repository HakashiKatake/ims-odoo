import { Sidebar } from '@/components/sidebar';
import  AIChat  from '@/components/ai-chatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0E14] flex">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
      <AIChat inventory={[]} history={[]} />
    </div>
  );
}
