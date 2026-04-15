import Sidebar from "@/components/layout/Sidebar";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[var(--cal-bg-subtle)] p-4 pt-16 sm:p-6 sm:pt-16 lg:ml-[224px] lg:p-8 lg:pt-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
