"use client";

interface ReadinessData {
  subThreeProbability: number;
  injuryRisk: "low" | "moderate" | "elevated" | "high";
  weeksTo95: number;
}

export default function ReadinessNumbers({ data }: { data: ReadinessData }) {
  const riskColors = {
    low: "text-accent",
    moderate: "text-warning",
    elevated: "text-warning",
    high: "text-danger",
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Sub-3 Probability */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="text-muted text-xs uppercase tracking-wider mb-1">
          Sub-3 Probability
        </div>
        <div className="text-3xl font-mono font-bold text-accent">
          {data.subThreeProbability}%
        </div>
        <div className="text-muted text-xs mt-1">current fitness</div>
      </div>

      {/* Injury Risk */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="text-muted text-xs uppercase tracking-wider mb-1">
          Injury Risk
        </div>
        <div className={`text-3xl font-mono font-bold ${riskColors[data.injuryRisk]}`}>
          {data.injuryRisk.charAt(0).toUpperCase() + data.injuryRisk.slice(1)}
        </div>
        <div className="text-muted text-xs mt-1">training load</div>
      </div>

      {/* Weeks to 95% */}
      <div className="bg-surface rounded-xl p-4 border border-border">
        <div className="text-muted text-xs uppercase tracking-wider mb-1">
          Weeks to 95%
        </div>
        <div className="text-3xl font-mono font-bold text-foreground">
          {data.weeksTo95}
        </div>
        <div className="text-muted text-xs mt-1">at current trajectory</div>
      </div>
    </div>
  );
}
