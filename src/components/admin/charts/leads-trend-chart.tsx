"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import type { LeadTrendData } from "@/lib/db/admin-queries";

interface LeadsTrendChartProps {
	data: LeadTrendData[];
}

function formatDateLabel(dateStr: string): string {
	const date = new Date(dateStr);
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "short",
	}).format(date);
}

export function LeadsTrendChart({ data }: LeadsTrendChartProps) {
	const hasData = data.length > 0;

	if (!hasData) {
		return (
			<div className="flex items-center justify-center h-[200px] text-muted-foreground">
				No hay datos disponibles
			</div>
		);
	}

	const chartData = data.map((item) => ({
		...item,
		dateLabel: formatDateLabel(item.date),
	}));

	return (
		<ResponsiveContainer width="100%" height={200}>
			<LineChart
				data={chartData}
				margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
				<XAxis
					dataKey="dateLabel"
					tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
					tickLine={false}
					axisLine={{ stroke: "hsl(var(--border))" }}
				/>
				<YAxis
					allowDecimals={false}
					tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
					tickLine={false}
					axisLine={{ stroke: "hsl(var(--border))" }}
					width={30}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--card))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "0.5rem",
						padding: "0.5rem 0.75rem",
					}}
					formatter={(value) => [`${value ?? 0} leads`, "Leads"]}
					labelFormatter={(label) => `Fecha: ${label}`}
				/>
				<Line
					type="monotone"
					dataKey="count"
					stroke="var(--casalia-orange)"
					strokeWidth={2}
					dot={{ fill: "var(--casalia-orange)", strokeWidth: 0, r: 4 }}
					activeDot={{ r: 6, fill: "var(--casalia-orange)" }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
