import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub Three — Your AI Training Companion",
  description:
    "An AI companion that knows you, adapts to your life, and helps you break the three-hour marathon barrier.",
};

export default function CompanionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The companion experience is a fixed-height split-screen — no page scroll.
  // We lock the viewport here so the chat and dashboard scroll independently inside.
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background">
      {children}
    </div>
  );
}
