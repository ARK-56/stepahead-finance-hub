import { ReactNode } from "react";

interface ToolShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AdSlot = ({ label }: { label: string }) => (
  <div className="ad-slot rounded-lg p-4 flex flex-col items-center justify-center min-h-[250px] text-muted-foreground text-sm">
    <span className="font-medium mb-1">Ad Space</span>
    <span className="text-xs">{label}</span>
  </div>
);

export default function ToolShell({ title, description, children }: ToolShellProps) {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
      </div>

      {/* Top banner ad */}
      <div className="ad-slot rounded-lg p-3 flex items-center justify-center h-[90px] text-muted-foreground text-sm mb-8">
        <span className="text-xs">Advertisement — 728×90 Leaderboard</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="surface-elevated rounded-xl p-6 md:p-8">
            {children}
          </div>
        </div>

        {/* Sidebar ads */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
          <AdSlot label="300×250 Medium Rectangle" />
          <AdSlot label="300×250 Medium Rectangle" />
        </aside>
      </div>
    </div>
  );
}
