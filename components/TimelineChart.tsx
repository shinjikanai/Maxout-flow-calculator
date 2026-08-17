"use client";

import { TimelinePoint } from "@/lib/calc";
import { Dict } from "@/lib/i18n";

interface Props {
  points: TimelinePoint[];
  capacity: number; // full concurrent capacity (L_max)
  target: number; // steady-state concurrency (L_target)
  stayMinutes: number; // W — where the ramp ends
  t: Dict["chart"];
  fmt: (n: number) => string;
}

// Brand colors
const C = {
  grid: "#e5e9f0",
  axis: "#334155",
  tick: "#6b7280",
  blue: "#3b6fe0",
  teal: "#00c4b4",
  tealD: "#00a497",
  tealText: "#048b7f",
  danger: "#ef4444",
  warn: "#f59e0b",
};

const W = 760;
const H = 380;
const PAD = { top: 28, right: 20, bottom: 46, left: 68 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

export default function TimelineChart({
  points,
  capacity,
  target,
  stayMinutes,
  t,
  fmt,
}: Props) {
  if (!points.length || capacity <= 0) return null;

  const maxMinute = points[points.length - 1].minute;
  const yMax = capacity * 1.08; // headroom above the full-capacity line

  const x = (m: number) => PAD.left + (m / maxMinute) * plotW;
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  // Split the curve into fill phase (<= W) and steady phase (>= W).
  const fillPts = points.filter((p) => p.minute <= stayMinutes);
  const steadyPts = points.filter((p) => p.minute >= stayMinutes);

  const toLine = (pts: TimelinePoint[]) =>
    pts.map((p) => `${x(p.minute)},${y(p.active)}`).join(" ");

  const areaPath = (pts: TimelinePoint[]) => {
    if (pts.length < 2) return "";
    const top = pts.map((p) => `${x(p.minute)},${y(p.active)}`).join(" L ");
    const x0 = x(pts[0].minute);
    const x1 = x(pts[pts.length - 1].minute);
    const yBase = y(0);
    return `M ${x0},${yBase} L ${top} L ${x1},${yBase} Z`;
  };

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i);

  const xStep = Math.max(1, Math.round(maxMinute / 10));
  const xTickVals: number[] = [];
  for (let m = 0; m <= maxMinute; m += xStep) xTickVals.push(m);
  if (xTickVals[xTickVals.length - 1] !== maxMinute) xTickVals.push(maxMinute);

  const transitionM = Math.min(Math.round(stayMinutes) + 1, maxMinute);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={t.heading}
        style={{ display: "block", minWidth: 480 }}
      >
        <defs>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.28" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="steadyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0.3" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTickVals.map((v, i) => (
          <g key={`y${i}`}>
            <line x1={PAD.left} y1={y(v)} x2={W - PAD.right} y2={y(v)} stroke={C.grid} strokeWidth={1} />
            <text x={PAD.left - 10} y={y(v) + 4} textAnchor="end" fontSize={12} fill={C.tick}>
              {fmt(Math.round(v))}
            </text>
          </g>
        ))}

        {/* Full capacity line */}
        <line
          x1={PAD.left}
          y1={y(capacity)}
          x2={W - PAD.right}
          y2={y(capacity)}
          stroke={C.danger}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text x={W - PAD.right} y={y(capacity) - 6} textAnchor="end" fontSize={11} fill={C.danger}>
          {t.legendCapacity} · {fmt(Math.round(capacity))}
        </text>

        {/* Target concurrency line */}
        {target > 0 && target < capacity && (
          <>
            <line
              x1={PAD.left}
              y1={y(target)}
              x2={W - PAD.right}
              y2={y(target)}
              stroke={C.tealD}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text x={W - PAD.right} y={y(target) - 6} textAnchor="end" fontSize={11} fill={C.tealText}>
              {t.legendTarget} · {fmt(Math.round(target))}
            </text>
          </>
        )}

        {/* Areas */}
        <path d={areaPath(fillPts)} fill="url(#fillGrad)" />
        <path d={areaPath(steadyPts)} fill="url(#steadyGrad)" />

        {/* Lines */}
        <polyline points={toLine(fillPts)} fill="none" stroke={C.blue} strokeWidth={2.5} />
        <polyline points={toLine(steadyPts)} fill="none" stroke={C.teal} strokeWidth={2.5} />

        {/* Transition marker */}
        <line
          x1={x(transitionM)}
          y1={PAD.top}
          x2={x(transitionM)}
          y2={PAD.top + plotH}
          stroke={C.warn}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <circle cx={x(transitionM)} cy={y(target)} r={4} fill={C.warn} />

        {/* X axis */}
        <line
          x1={PAD.left}
          y1={PAD.top + plotH}
          x2={W - PAD.right}
          y2={PAD.top + plotH}
          stroke="#cbd5e1"
          strokeWidth={1.5}
        />
        {xTickVals.map((m, i) => (
          <text key={`x${i}`} x={x(m)} y={PAD.top + plotH + 20} textAnchor="middle" fontSize={12} fill={C.tick}>
            {m}
          </text>
        ))}

        {/* Axis titles */}
        <text x={PAD.left + plotW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill={C.axis}>
          {t.xAxis}
        </text>
        <text
          x={16}
          y={PAD.top + plotH / 2}
          textAnchor="middle"
          fontSize={12}
          fill={C.axis}
          transform={`rotate(-90 16 ${PAD.top + plotH / 2})`}
        >
          {t.yAxis}
        </text>
      </svg>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          fontSize: 13,
          color: C.axis,
          marginTop: 8,
        }}
      >
        <Legend color={C.blue} label={t.legendFill} />
        <Legend color={C.teal} label={t.legendSteady} />
        <Legend color={C.warn} label={t.transitionNote(transitionM)} />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{ width: 12, height: 12, borderRadius: 3, background: color, display: "inline-block" }}
      />
      {label}
    </span>
  );
}
