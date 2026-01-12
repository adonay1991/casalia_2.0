"use client";

import {
	EnvelopeSimple as EmailIcon,
	Eye as EyeIcon,
	EyeSlash as EyeSlashIcon,
	SpinnerGap as SpinnerIcon,
} from "@phosphor-icons/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

interface LoginFormProps {
	redirectTo?: string;
}

interface FormState {
	error?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
	const [showPassword, setShowPassword] = useState(false);

	const loginWithState = async (
		_prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		const result = await login(formData);
		return { error: result?.error };
	};

	const [state, formAction, isPending] = useActionState(loginWithState, {
		error: undefined,
	});

	return (
		<form action={formAction} className="space-y-4">
			<input type="hidden" name="redirect" value={redirectTo || ""} />

			{state.error && (
				<div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
					{state.error}
				</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<div className="relative">
					<EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="tu@email.com"
						className="pl-9"
						required
						disabled={isPending}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Contrasena</Label>
				<div className="relative">
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						placeholder="Tu contrasena"
						className="pr-10"
						required
						disabled={isPending}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						tabIndex={-1}
					>
						{showPassword ? (
							<EyeSlashIcon className="h-4 w-4" />
						) : (
							<EyeIcon className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			<Button
				type="submit"
				className="w-full bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
						Iniciando sesion...
					</>
				) : (
					"Iniciar sesion"
				)}
			</Button>
		</form>
	);
}
