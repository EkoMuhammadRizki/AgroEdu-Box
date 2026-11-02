"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SensorHistoryPoint } from "@/lib/types";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";

const RANGES = ["24 jam", "7 hari", "30 hari"] as const;
type Range = typeof RANGES[number];

interface SensorChartProps {
  data: SensorHistoryPoint[];
  unit: string;
  color?: string;
  label: string;
  isSimulation?: boolean;
}

export function SensorChart({ data, unit, color = "var(--accent)", label, isSimulation }: SensorChartProps) {
  const [range, setRange] = useState<Range>("24 jam");

  // Filter data based on range (mock — just slice)
  const slicedData = range === "24 jam" ? data.slice(-24) : range === "7 hari" ? data.slice(-7 * 24) : data;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-ink">{label}</h3>
          {isSimulation && (
            <StatusBadge status="simulasi" />
          )}
        </div>

        {/* Range segmented control */}
        <div className="flex gap-1 rounded-xl bg-surface-muted border border-line p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                range === r
                  ? "bg-surface shadow-sm text-[var(--accent)] font-semibold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={slicedData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DCE5DF" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#5F7068" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#5F7068" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}${unit}`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #DCE5DF", fontSize: 12 }}
            formatter={(val) => [`${val}${unit}`, label]}
            labelStyle={{ color: "#5F7068" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-2 text-[10px] text-ink-muted">
        Garis terputus = data tidak tersedia. Nilai ditampilkan sesuai data aktual.
      </p>
    </div>
  );
}
