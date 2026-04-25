import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Support Technique", value: 32 },
  { name: "Dem. Administrative", value: 45 },
  { name: "Dem. Pédagogique", value: 38 },
  { name: "Partenariat", value: 13 },
];

export default function CategoriesChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Répartition par catégorie
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#f9fafb",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}