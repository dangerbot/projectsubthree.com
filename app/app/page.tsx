import ChatPanel from "./components/ChatPanel";
import DashboardPanel from "./components/DashboardPanel";

export default function Home() {
  return (
    <div className="flex h-full">
      {/* Left: Conversation */}
      <div className="flex-1 border-r border-border">
        <ChatPanel />
      </div>

      {/* Right: Dashboard */}
      <div className="w-[420px] flex-shrink-0">
        <DashboardPanel />
      </div>
    </div>
  );
}
