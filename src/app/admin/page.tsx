import {
	ArrowUp as ArrowUpIcon,
	Article as BlogIcon,
	Users as LeadsIcon,
	House as PropertyIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { LeadsTrendChart } from "@/components/admin/charts/leads-trend-chart";
import { PropertiesStatusChart } from "@/components/admin/charts/properties-status-chart";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import {
	getDashboardStats,
	getLeadsTrend,
	getPropertiesByStatus,
	getRecentLeads,
	getTopProperties,
} from "@/lib/db/admin-queries";

export const metadata: Metadata = {
	title: "Dashboard | Casalia Admin",
	description: "Panel de control de Casalia",
};

export default async function AdminDashboardPage() {
	const user = await getCurrentUser();

	if (!user) {
		return null;
	}

	const [stats, recentLeads, topProperties, propertiesByStatus, leadsTrend] =
		await Promise.all([
			getDashboardStats(),
			getRecentLeads(5),
			getTopProperties(5),
			getPropertiesByStatus(),
			getLeadsTrend(7),
		]);

	return (
		<>
			<AdminHeader
				title="Dashboard"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6 space-y-6">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						title="Propiedades"
						value={stats.totalProperties}
						change={stats.propertiesThisMonth}
						changeLabel="este mes"
						icon={PropertyIcon}
						href="/admin/propiedades"
					/>
					<StatsCard
						title="Disponibles"
						value={stats.availableProperties}
						subtitle={`${stats.soldProperties} vendidas`}
						icon={PropertyIcon}
						variant="success"
					/>
					<StatsCard
						title="Leads"
						value={stats.totalLeads}
						change={stats.leadsThisMonth}
						changeLabel="este mes"
						icon={LeadsIcon}
						href="/admin/leads"
					/>
					<StatsCard
						title="Posts"
						value={stats.totalPosts}
						subtitle={`${stats.publishedPosts} publicados`}
						icon={BlogIcon}
						href="/admin/blog"
					/>
				</div>

				{/* Charts Grid */}
				<div className="grid lg:grid-cols-2 gap-6">
					{/* Properties by Status - Pie Chart */}
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">
							Propiedades por estado
						</h2>
						<PropertiesStatusChart data={propertiesByStatus} />
					</Card>

					{/* Leads Trend - Line Chart */}
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">Leads ultimos 7 dias</h2>
						<LeadsTrendChart data={leadsTrend} />
					</Card>
				</div>

				{/* Content Grid */}
				<div className="grid lg:grid-cols-2 gap-6">
					{/* Recent Leads */}
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Leads recientes</h2>
							<Link
								href="/admin/leads"
								className="text-sm text-[var(--casalia-orange)] hover:underline"
							>
								Ver todos
							</Link>
						</div>

						{recentLeads.length > 0 ? (
							<div className="space-y-3">
								{recentLeads.map((lead) => (
									<div
										key={lead.id}
										className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg"
									>
										<div>
											<p className="font-medium">{lead.name}</p>
											<p className="text-sm text-muted-foreground">
												{lead.email || lead.phone}
											</p>
										</div>
										<div className="text-right">
											<span
												className={`inline-block px-2 py-1 text-xs font-medium rounded ${
													lead.status === "nuevo"
														? "bg-green-100 text-green-700"
														: lead.status === "contactado"
															? "bg-blue-100 text-blue-700"
															: "bg-zinc-100 text-zinc-700"
												}`}
											>
												{lead.status}
											</span>
											<p className="text-xs text-muted-foreground mt-1">
												{formatDate(lead.createdAt)}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay leads recientes
							</p>
						)}
					</Card>

					{/* Top Properties */}
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Propiedades destacadas</h2>
							<Link
								href="/admin/propiedades"
								className="text-sm text-[var(--casalia-orange)] hover:underline"
							>
								Ver todas
							</Link>
						</div>

						{topProperties.length > 0 ? (
							<div className="space-y-3">
								{topProperties.map((property) => (
									<div
										key={property.id}
										className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg"
									>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{property.title}</p>
											<p className="text-sm text-muted-foreground">
												{formatPrice(property.price)}
												{property.operationType === "alquiler" && "/mes"}
											</p>
										</div>
										<span
											className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
												property.status === "disponible"
													? "bg-green-100 text-green-700"
													: property.status === "reservado"
														? "bg-yellow-100 text-yellow-700"
														: "bg-zinc-100 text-zinc-700"
											}`}
										>
											{property.status}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-center py-8">
								No hay propiedades
							</p>
						)}
					</Card>
				</div>
			</main>
		</>
	);
}

interface StatsCardProps {
	title: string;
	value: number;
	change?: number;
	changeLabel?: string;
	subtitle?: string;
	icon: React.ElementType;
	href?: string;
	variant?: "default" | "success";
}

function StatsCard({
	title,
	value,
	change,
	changeLabel,
	subtitle,
	icon: Icon,
	href,
	variant = "default",
}: StatsCardProps) {
	const content = (
		<Card className="p-6 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm text-muted-foreground">{title}</p>
					<p className="text-3xl font-bold mt-1">{value}</p>
					{change !== undefined && (
						<p className="text-sm text-green-600 flex items-center gap-1 mt-1">
							<ArrowUpIcon className="h-3 w-3" />+{change} {changeLabel}
						</p>
					)}
					{subtitle && (
						<p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
					)}
				</div>
				<div
					className={`p-3 rounded-lg ${
						variant === "success"
							? "bg-green-100 text-green-600"
							: "bg-[var(--casalia-orange)]/10 text-[var(--casalia-orange)]"
					}`}
				>
					<Icon className="h-6 w-6" />
				</div>
			</div>
		</Card>
	);

	if (href) {
		return <Link href={href}>{content}</Link>;
	}

	return content;
}

function formatPrice(price: string | number): string {
	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(numericPrice);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "short",
	}).format(date);
}
