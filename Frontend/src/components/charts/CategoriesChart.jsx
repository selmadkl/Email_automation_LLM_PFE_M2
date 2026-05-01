import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const LABELS = {
  "Support_Technique"      : "Support Tech.",
  "Demande_Administrative" : "Dem. Admin.",
  "Demande_Pedagogique"    : "Dem. Pédag.",
  "Partenariat"            : "Partenariat",
};

export default function CategoriesChart({ data = [] }) {
  const formatted = data.map((item, i) => ({
    name  : LABELS[item.categorie] || item.categorie,
    value : item.total,
    color : COLORS[i % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, name) => [value, "Emails"]}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            color: "#f9fafb",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {formatted.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}