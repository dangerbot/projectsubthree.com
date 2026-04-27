"use client";

interface RunnerContextData {
  sustainedMileage: number;
  peakMileage: number;
  longestRun: number;
  currentVdot: number;
  targetVdot: number;
  recentRaces: { distance: string; time: string; date: string }[];
}

export default function RunnerContext({ data }: { data: RunnerContextData }) {
  const vdotProgress = Math.min(
    100,
    ((data.currentVdot - 40) / (data.targetVdot - 40)) * 100
  );

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Runner Context
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Mileage */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted mb-0.5">Sustained</div>
            <div className="text-lg font-mono font-semibold text-foreground">
              {data.sustainedMileage}
              <span className="text-xs text-muted ml-1">mi/wk</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-0.5">Peak Week</div>
            <div className="text-lg font-mono font-semibold text-foreground">
              {data.peakMileage}
              <span className="text-xs text-muted ml-1">mi</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-0.5">Long Run</div>
            <div className="text-lg font-mono font-semibold text-foreground">
              {data.longestRun}
              <span className="text-xs text-muted ml-1">mi</span>
            </div>
          </div>
        </div>

        {/* VDOT Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted">
              VDOT Progress
            </span>
            <span className="text-xs font-mono text-muted-light">
              {data.currentVdot} → {data.targetVdot}
            </span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${vdotProgress}%` }}
            />
          </div>
        </div>

        {/* Recent Races */}
        {data.recentRaces.length > 0 && (
          <div>
            <div className="text-xs text-muted mb-2">Recent Races</div>
            <div className="space-y-1.5">
              {data.recentRaces.map((race, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-light">{race.distance}</span>
                  <span className="font-mono text-foreground">{race.time}</span>
                  <span className="text-muted">{race.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
