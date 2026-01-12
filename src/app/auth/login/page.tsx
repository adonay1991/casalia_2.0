import { Lock as LockIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "Iniciar sesion | Casalia Admin",
	description: "Accede al panel de administracion de Casalia",
};

interface LoginPageProps {
	searchParams: Promise<{
		redirect?: string;
		error?: string;
	}>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const params = await searchParams;

	// If already logged in, redirect to admin
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (user) {
		redirect(params.redirect || "/admin");
	}

	return (
		<div className="min-h-screen flex">
			{/* Left side - Brand */}
			<div className="hidden lg:flex lg:w-1/2 bg-[var(--casalia-dark)] items-center justify-center p-12">
				<div className="max-w-md text-center">
					<Link href="/" className="inline-block mb-8">
						<Image
							src="/casalia-logo-white.svg"
							alt="Casalia"
							width={200}
							height={60}
							className="h-16 w-auto"
						/>
					</Link>
					<h1 className="text-3xl font-bold text-white mb-4">
						Panel de Administracion
					</h1>
					<p className="text-white/70">
						Gestiona propiedades, leads y contenido de tu inmobiliaria desde un
						solo lugar.
					</p>
				</div>
			</div>

			{/* Right side - Login Form */}
			<div className="flex-1 flex items-center justify-center p-8">
				<div className="w-full max-w-md">
					{/* Mobile logo */}
					<div className="lg:hidden text-center mb-8">
						<Link href="/" className="inline-block">
							<Image
								src="/casalia-logo.svg"
								alt="Casalia"
								width={160}
								height={48}
								className="h-12 w-auto"
							/>
						</Link>
					</div>

					<div className="bg-card border border-border rounded-lg p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-10 h-10 rounded-full bg-[var(--casalia-orange)]/10 flex items-center justify-center">
								<LockIcon className="h-5 w-5 text-[var(--casalia-orange)]" />
							</div>
							<div>
								<h2 className="text-xl font-semibold">Iniciar sesion</h2>
								<p className="text-sm text-muted-foreground">
									Accede a tu cuenta
								</p>
							</div>
						</div>

						{params.error && (
							<div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
								{params.error}
							</div>
						)}

						<LoginForm redirectTo={params.redirect} />

						<div className="mt-6 text-center text-sm text-muted-foreground">
							<Link
								href="/"
								className="hover:text-foreground transition-colors"
							>
								Volver a la web
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
