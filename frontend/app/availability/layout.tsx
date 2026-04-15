import Sidebar from "@/components/layout/Sidebar";

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[224px] flex-1 min-h-screen bg-[var(--cal-bg-subtle)] p-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
