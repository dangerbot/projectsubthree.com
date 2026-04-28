"use client";

/**
 * Animated lightning bolt "thinking" indicator.
 * Pure CSS keyframes — no framer-motion dependency.
 *
 * Inspired by Steve's ElectricBolt from steveandthedogs.com,
 * re-colored to the Sub Three accent green.
 */

const BOLT_PATH = "M 13 2 L 3 14 L 12 14 L 11 22 L 21 10 L 12 10 Z";

// 12 spark lines radiating from the bolt edges
const SPARKS = [
  { x1: 4, y1: 11, x2: -1, y2: 10, delay: "0s" },
  { x1: 3, y1: 14, x2: -1, y2: 16, delay: "0.35s" },
  { x1: 5, y1: 9, x2: 2, y2: 7, delay: "0.65s" },
  { x1: 20, y1: 10, x2: 25, y2: 9, delay: "0.15s" },
  { x1: 21, y1: 11, x2: 26, y2: 13, delay: "0.5s" },
  { x1: 20, y1: 8, x2: 24, y2: 6, delay: "0.8s" },
  { x1: 13, y1: 2, x2: 11, y2: -3, delay: "0.25s" },
  { x1: 14, y1: 3, x2: 18, y2: -1, delay: "0.55s" },
  { x1: 11, y1: 22, x2: 8, y2: 27, delay: "0.1s" },
  { x1: 12, y1: 22, x2: 15, y2: 27, delay: "0.4s" },
  { x1: 10, y1: 13, x2: 6, y2: 11, delay: "0.3s" },
  { x1: 14, y1: 9, x2: 18, y2: 7, delay: "0.7s" },
];

export default function ThinkingBolt() {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="relative w-7 h-7 flex items-center justify-center">
        {/* Ambient glow behind bolt */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)",
          }}
        />
        <svg
          viewBox="0 0 24 24"
          width={28}
          height={28}
          style={{ overflow: "visible" }}
        >
          {/* Main bolt — crackle animation */}
          <path
            d={BOLT_PATH}
            className="thinking-bolt-fill"
          />
          {/* Spark lines */}
          {SPARKS.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="var(--accent)"
              strokeWidth="0.7"
              strokeLinecap="round"
              className="thinking-spark"
              style={{
                animationDelay: s.delay,
                filter: "drop-shadow(0 0 2px var(--accent))",
              }}
            />
          ))}
        </svg>
      </div>
      <style jsx>{`
        .thinking-bolt-fill {
          fill: var(--accent);
          animation: bolt-crackle 1.6s ease-out infinite;
        }

        .thinking-spark {
          opacity: 0;
          animation: spark-flash 1.6s ease-out infinite;
        }

        @keyframes bolt-crackle {
          0%,
          25% {
            fill: var(--accent);
            filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.3));
          }
          32% {
            fill: #86efac;
            filter: drop-shadow(0 0 18px rgba(34, 197, 94, 1))
              drop-shadow(0 0 8px rgba(255, 255, 255, 0.35));
          }
          40% {
            fill: var(--accent);
            filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.45));
          }
          100% {
            fill: var(--accent);
            filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.3));
          }
        }

        @keyframes spark-flash {
          0%,
          5% {
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          18% {
            opacity: 0.6;
          }
          25% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
