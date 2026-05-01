import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  "Haute"   : "#ef4444",
  "Moyenne" : "#f59e0b",
  "Basse"   : "#10b981",
};

export default function PrioriteChart({ data = [] }) {
  const formatted = data.map(item => ({
    name  : item.priorite_finale,
    value : item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          label={({ name, value }) => `${value}`}
          labelLine={false}
        >
          {formatted.map((entry, i) => (
            <Cell key={i} fill={COLORS[entry.name] || "#6366f1"} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            color: "#f9fafb",
            fontSize: "12px",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}