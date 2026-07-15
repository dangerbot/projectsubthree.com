/**
 * Aspirational architecture diagram for the /tech page.
 * Shows how a runner-facing companion routes through specialist AI models
 * and skills, all pivoting on a shared Runner Context, deployed on a
 * modern AI-friendly stack.
 *
 * Colors reference the app's dark-theme tokens (background/foreground/
 * border/accent) so it blends into any content page without a wrapper.
 */
export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 940 760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      className="w-full h-auto"
      style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
    >
      <title>Project Sub Three — architecture</title>
      <desc>
        A runner chasing sub-three interacts with a companion experience.
        The companion orchestrator routes to specialist AI models — chat,
        context, coach, reasoner — which use tools and skills to act.
        Everything reads from and writes to a single runner context,
        persisted in Supabase. The whole thing is built on Claude Code,
        GitHub, Vercel, and Supabase.
      </desc>

      <defs>
        <marker
          id="arch-arr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#737373" />
        </marker>
        <marker
          id="arch-arr-accent"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#22c55e" />
        </marker>
      </defs>

      <style>{`
        .arch-box { fill: rgba(255,255,255,0.03); stroke: #333333; stroke-width: 1.5; }
        .arch-box-hero { fill: rgba(34,197,94,0.10); stroke: #22c55e; stroke-width: 2; }
        .arch-box-brain { fill: rgba(34,197,94,0.04); stroke: #22c55e; stroke-width: 1.25; stroke-dasharray: 4,3; }
        .arch-box-brain-inner { fill: rgba(34,197,94,0.03); stroke: #22c55e; stroke-width: 1.25; }
        .arch-box-context { fill: rgba(34,197,94,0.16); stroke: #22c55e; stroke-width: 2; }
        .arch-box-persist { fill: rgba(255,255,255,0.03); stroke: #333333; stroke-width: 1.5; stroke-dasharray: 4,3; }
        .arch-foundation { fill: rgba(255,255,255,0.02); stroke: #262626; stroke-width: 1; }
        .arch-hero-title { fill: #ededed; font-size: 18px; font-weight: 700; letter-spacing: 1px; }
        .arch-title { fill: #ededed; font-size: 13px; font-weight: 600; }
        .arch-subtitle { fill: #a3a3a3; font-size: 10px; font-weight: 400; }
        .arch-chip-title { fill: #ededed; font-size: 11px; font-weight: 600; }
        .arch-chip-subtitle { fill: #a3a3a3; font-size: 9px; font-weight: 400; }
        .arch-layer { fill: #737373; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .arch-foundation-label { fill: #a3a3a3; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .arch-foundation-item { fill: #ededed; font-size: 12px; font-weight: 600; }
        .arch-arrow { stroke: #737373; stroke-width: 1.5; fill: none; }
        .arch-arrow-accent { stroke: #22c55e; stroke-width: 1.75; fill: none; }
        .arch-arrow-dashed { stroke: #737373; stroke-width: 1.5; fill: none; stroke-dasharray: 4,3; }
        .arch-note { fill: #737373; font-size: 10px; font-style: italic; }
      `}</style>

      {/* Layer labels */}
      <text x="20" y="65" className="arch-layer">Runner</text>
      <text x="20" y="175" className="arch-layer">Browser</text>
      <text x="20" y="275" className="arch-layer">Router</text>
      <text x="20" y="370" className="arch-layer">AI Layer</text>
      <text x="20" y="490" className="arch-layer">Actions</text>
      <text x="20" y="605" className="arch-layer">State</text>

      {/* ═══ Hero: YOU ═══ */}
      <rect x="330" y="30" width="280" height="70" rx="10" className="arch-box-hero" />
      <text x="470" y="62" textAnchor="middle" className="arch-hero-title">YOU</text>
      <text x="470" y="83" textAnchor="middle" className="arch-subtitle">Runner chasing 2:59:59</text>

      {/* ═══ Browser: Chat + Dashboard ═══ */}
      <rect x="180" y="140" width="240" height="70" rx="8" className="arch-box" />
      <text x="300" y="166" textAnchor="middle" className="arch-title">Chat Panel</text>
      <text x="300" y="186" textAnchor="middle" className="arch-subtitle">The conversation</text>

      <rect x="520" y="140" width="240" height="70" rx="8" className="arch-box" />
      <text x="640" y="166" textAnchor="middle" className="arch-title">Dashboard</text>
      <text x="640" y="186" textAnchor="middle" className="arch-subtitle">Readiness, plan, editable context</text>

      {/* ═══ Companion Orchestrator ═══ */}
      <rect x="290" y="240" width="360" height="60" rx="8" className="arch-box" />
      <text x="470" y="266" textAnchor="middle" className="arch-title">Companion Orchestrator</text>
      <text x="470" y="285" textAnchor="middle" className="arch-subtitle">Picks the right brain and skill for each moment</text>

      {/* ═══ AI Layer — Specialist Models ═══ */}
      <rect x="80" y="340" width="780" height="110" rx="10" className="arch-box-brain" />
      <text x="98" y="360" className="arch-chip-subtitle">Specialist models · one brain per job</text>

      <rect x="100" y="370" width="180" height="65" rx="6" className="arch-box-brain-inner" />
      <text x="190" y="393" textAnchor="middle" className="arch-chip-title">Chat model</text>
      <text x="190" y="410" textAnchor="middle" className="arch-chip-subtitle">Fast, casual conversation</text>
      <text x="190" y="425" textAnchor="middle" className="arch-chip-subtitle">Small · cheap · always-on</text>

      <rect x="295" y="370" width="180" height="65" rx="6" className="arch-box-brain-inner" />
      <text x="385" y="393" textAnchor="middle" className="arch-chip-title">Context model</text>
      <text x="385" y="410" textAnchor="middle" className="arch-chip-subtitle">Understands YOU</text>
      <text x="385" y="425" textAnchor="middle" className="arch-chip-subtitle">Memory · patterns · signals</text>

      <rect x="490" y="370" width="180" height="65" rx="6" className="arch-box-brain-inner" />
      <text x="580" y="393" textAnchor="middle" className="arch-chip-title">Coach model</text>
      <text x="580" y="410" textAnchor="middle" className="arch-chip-subtitle">Understands running</text>
      <text x="580" y="425" textAnchor="middle" className="arch-chip-subtitle">Training · pacing · recovery</text>

      <rect x="685" y="370" width="160" height="65" rx="6" className="arch-box-brain-inner" />
      <text x="765" y="393" textAnchor="middle" className="arch-chip-title">Reasoner</text>
      <text x="765" y="410" textAnchor="middle" className="arch-chip-subtitle">Hard tradeoffs</text>
      <text x="765" y="425" textAnchor="middle" className="arch-chip-subtitle">Race day · big changes</text>

      <text x="860" y="332" textAnchor="end" className="arch-note">
        Today: Sonnet 4.6 does all four. Tomorrow: specialize.
      </text>

      {/* ═══ Tools & Skills ═══ */}
      <rect x="80" y="470" width="780" height="90" rx="10" className="arch-box-brain" />
      <text x="98" y="490" className="arch-chip-subtitle">Tools &amp; skills · what the models can DO</text>

      <rect x="100" y="500" width="130" height="50" rx="6" className="arch-box-brain-inner" />
      <text x="165" y="521" textAnchor="middle" className="arch-chip-title">Plan generator</text>
      <text x="165" y="537" textAnchor="middle" className="arch-chip-subtitle">Build &amp; rebuild plans</text>

      <rect x="245" y="500" width="130" height="50" rx="6" className="arch-box-brain-inner" />
      <text x="310" y="521" textAnchor="middle" className="arch-chip-title">Log workout</text>
      <text x="310" y="537" textAnchor="middle" className="arch-chip-subtitle">Mark runs complete</text>

      <rect x="390" y="500" width="130" height="50" rx="6" className="arch-box-brain-inner" />
      <text x="455" y="521" textAnchor="middle" className="arch-chip-title">Data sync</text>
      <text x="455" y="537" textAnchor="middle" className="arch-chip-subtitle">Strava · Garmin · Apple</text>

      <rect x="535" y="500" width="130" height="50" rx="6" className="arch-box-brain-inner" />
      <text x="600" y="521" textAnchor="middle" className="arch-chip-title">Fuel &amp; nutrition</text>
      <text x="600" y="537" textAnchor="middle" className="arch-chip-subtitle">Calorie · carb targets</text>

      <rect x="680" y="500" width="160" height="50" rx="6" className="arch-box-brain-inner" />
      <text x="760" y="521" textAnchor="middle" className="arch-chip-title">Race-day pacer</text>
      <text x="760" y="537" textAnchor="middle" className="arch-chip-subtitle">Splits · weather · goal</text>

      {/* ═══ Runner Context (source of truth) ═══ */}
      <rect x="290" y="580" width="360" height="55" rx="8" className="arch-box-context" />
      <text x="470" y="603" textAnchor="middle" className="arch-title">Runner Context</text>
      <text x="470" y="622" textAnchor="middle" className="arch-subtitle">Single source of truth · read by all, written by many</text>

      {/* Supabase persistence */}
      <rect x="700" y="580" width="180" height="55" rx="8" className="arch-box-persist" />
      <text x="790" y="603" textAnchor="middle" className="arch-title">Supabase</text>
      <text x="790" y="622" textAnchor="middle" className="arch-subtitle">Auth · Postgres · RLS</text>

      {/* ═══ Arrows ═══ */}
      {/* YOU ↔ Browser */}
      <path d="M 400 100 L 310 138" className="arch-arrow" markerEnd="url(#arch-arr)" />
      <path d="M 540 100 L 630 138" className="arch-arrow" markerEnd="url(#arch-arr)" />

      {/* Browser → Orchestrator */}
      <path d="M 320 210 L 380 238" className="arch-arrow" markerEnd="url(#arch-arr)" />
      <path d="M 620 210 L 560 238" className="arch-arrow" markerEnd="url(#arch-arr)" />

      {/* Orchestrator → AI Layer (accent) */}
      <path d="M 470 300 L 470 338" className="arch-arrow-accent" markerEnd="url(#arch-arr-accent)" />

      {/* AI Layer → Tools (accent) */}
      <path d="M 470 450 L 470 468" className="arch-arrow-accent" markerEnd="url(#arch-arr-accent)" />

      {/* Tools → Runner Context */}
      <path d="M 470 560 L 470 578" className="arch-arrow" markerEnd="url(#arch-arr)" />

      {/* Runner Context ↔ Supabase */}
      <path d="M 650 605 L 700 605" className="arch-arrow" markerEnd="url(#arch-arr)" />
      <path d="M 700 615 L 650 615" className="arch-arrow" markerEnd="url(#arch-arr)" />

      {/* Dashboard direct edits → Runner Context (bypass AI) */}
      <path
        d="M 760 185 C 900 250, 900 550, 655 605"
        className="arch-arrow-dashed"
        markerEnd="url(#arch-arr)"
      />
      <text
        x="905"
        y="400"
        textAnchor="middle"
        className="arch-note"
        transform="rotate(90 905 400)"
      >
        Direct edits bypass the AI
      </text>

      {/* ═══ Foundation strip ═══ */}
      <rect x="20" y="680" width="900" height="60" rx="8" className="arch-foundation" />
      <text x="40" y="702" className="arch-foundation-label">Built on</text>
      <text x="185" y="720" textAnchor="middle" className="arch-foundation-item">Claude Code</text>
      <text x="185" y="732" textAnchor="middle" className="arch-chip-subtitle">Development</text>
      <text x="385" y="720" textAnchor="middle" className="arch-foundation-item">GitHub</text>
      <text x="385" y="732" textAnchor="middle" className="arch-chip-subtitle">Source control</text>
      <text x="585" y="720" textAnchor="middle" className="arch-foundation-item">Vercel</text>
      <text x="585" y="732" textAnchor="middle" className="arch-chip-subtitle">Deploy · edge · SSL</text>
      <text x="785" y="720" textAnchor="middle" className="arch-foundation-item">Supabase</text>
      <text x="785" y="732" textAnchor="middle" className="arch-chip-subtitle">Auth · database</text>
    </svg>
  );
}
