"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
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

export function SensorChart({ data, unit, color = "#6CC04A", label, isSimulation }: SensorChartProps) {
  const [range, setRange] = useState<Range>("24 jam");

  const slicedData = range === "24 jam" ? data.slice(-24) : range === "7 hari" ? data.slice(-7 * 24) : data;

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-extrabold text-sm md:text-base text-ink-900">{label}</h3>
          {isSimulation && (
            <StatusBadge status="simulasi" />
          )}
        </div>

        {/* Range control */}
        <div className="flex gap-1 rounded-pill bg-green-100 p-1 border border-green-200">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-pill text-xs font-heading font-bold transition-all ${
                range === r
                  ? "bg-white shadow-xs text-green-700"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[210px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={slicedData} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCEECC" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#5B6B45" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#5B6B45" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "2px solid #CDEBB0",
                fontSize: 12,
                backgroundColor: "#FFFBEA",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "#2F3B1F",
              }}
              formatter={(val) => [`${val}${unit}`, label]}
              labelStyle={{ color: "#5B6B45" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 2, fill: color }}
              activeDot={{ r: 5, strokeWidth: 0, fill: color }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-ink-600 font-medium">
        * Garis terputus menandakan periode di mana perangkat IoT dalam mode sleep/offline.
      </p>
    </div>
  );
}
