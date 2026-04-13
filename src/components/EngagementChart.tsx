import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ChartPoint {
  time: number;
  score: number;
  emotion: string;
}

interface EngagementChartProps {
  data: ChartPoint[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: ChartPoint }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2e] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white/60">{payload[0].payload.emotion}</p>
        <p className="text-white font-semibold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function EngagementChart({ data }: EngagementChartProps) {
  if (data.length < 2) {
    return (
      <div className="h-full flex items-center justify-center text-white/20 text-sm">
        Collecting data...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="time" hide />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={40} stroke="rgba(248,113,113,0.3)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#6366f1" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
