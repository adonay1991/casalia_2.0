"use client";

import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

import type { PropertyStatusData } from "@/lib/db/admin-queries";

interface PropertiesStatusChartProps {
	data: PropertyStatusData[];
}

interface ChartData {
	status: string;
	count: number;
	label: string;
	[key: string]: string | number;
}

const COLORS: Record<string, string> = {
	disponible: "#22c55e", // green-500
	reservado: "#eab308", // yellow-500
	vendido: "#3b82f6", // blue-500
	alquilado: "#8b5cf6", // violet-500
};

export function PropertiesStatusChart({ data }: PropertiesStatusChartProps) {
	const hasData = data.length > 0 && data.some((d) => d.count > 0);

	if (!hasData) {
		return (
			<div className="flex items-center justify-center h-[200px] text-muted-foreground">
				No hay datos disponibles
			</div>
		);
	}

	// Transform data to be compatible with Recharts
	const chartData: ChartData[] = data.map((d) => ({
		status: d.status,
		count: d.count,
		label: d.label,
	}));

	return (
		<ResponsiveContainer width="100%" height={200}>
			<PieChart>
				<Pie
					data={chartData}
					cx="50%"
					cy="50%"
					innerRadius={50}
					outerRadius={80}
					paddingAngle={2}
					dataKey="count"
					nameKey="label"
					label={({ name, percent }) => {
						const pct = percent ?? 0;
						return pct > 0.05 ? `${name} ${(pct * 100).toFixed(0)}%` : "";
					}}
					labelLine={false}
				>
					{chartData.map((entry) => (
						<Cell
							key={entry.status}
							fill={COLORS[entry.status] ?? "#94a3b8"}
							stroke="transparent"
						/>
					))}
				</Pie>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--card))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "0.5rem",
						padding: "0.5rem 0.75rem",
					}}
					formatter={(value, name) => [`${value ?? 0} propiedades`, name]}
				/>
				<Legend
					verticalAlign="bottom"
					height={36}
					formatter={(value: string) => (
						<span className="text-sm text-muted-foreground">{value}</span>
					)}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
