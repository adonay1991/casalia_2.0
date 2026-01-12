/**
 * Email Service using Resend
 *
 * SETUP:
 * 1. Get API key from https://resend.com
 * 2. Add RESEND_API_KEY to .env.local
 * 3. Verify your domain in Resend dashboard
 */

// import { Resend } from "resend";

// Uncomment when you have the API key:
// const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	from?: string;
	replyTo?: string;
}

const DEFAULT_FROM = "Casalia Inmobiliaria <noreply@casalia.org>";

/**
 * Send an email using Resend
 *
 * Currently disabled - waiting for API key
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		console.warn("[Email] RESEND_API_KEY not configured - email not sent");
		return {
			success: false,
			error: "Email service not configured",
		};
	}

	try {
		// Uncomment and use when API key is available:
		// const { data, error } = await resend.emails.send({
		//   from: options.from ?? DEFAULT_FROM,
		//   to: options.to,
		//   subject: options.subject,
		//   html: options.html,
		//   replyTo: options.replyTo,
		// });
		//
		// if (error) {
		//   return { success: false, error: error.message };
		// }
		//
		// return { success: true };

		console.log("[Email] Would send email:", {
			to: options.to,
			subject: options.subject,
			from: options.from ?? DEFAULT_FROM,
		});

		return { success: true };
	} catch (error) {
		console.error("[Email] Error sending email:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Email templates
 */
export const emailTemplates = {
	/**
	 * New lead notification for agents
	 */
	newLeadNotification: (lead: {
		name: string;
		email?: string;
		phone?: string;
		message?: string;
		propertyTitle?: string;
	}) => ({
		subject: `Nuevo lead: ${lead.name}`,
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
					.content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
					.field { margin-bottom: 16px; }
					.label { font-weight: 600; color: #6b7280; font-size: 14px; }
					.value { margin-top: 4px; }
					.cta { display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1 style="margin:0;">Nuevo Lead Recibido</h1>
					</div>
					<div class="content">
						<div class="field">
							<div class="label">Nombre</div>
							<div class="value">${lead.name}</div>
						</div>
						${lead.email ? `<div class="field"><div class="label">Email</div><div class="value">${lead.email}</div></div>` : ""}
						${lead.phone ? `<div class="field"><div class="label">Telefono</div><div class="value">${lead.phone}</div></div>` : ""}
						${lead.propertyTitle ? `<div class="field"><div class="label">Propiedad de interes</div><div class="value">${lead.propertyTitle}</div></div>` : ""}
						${lead.message ? `<div class="field"><div class="label">Mensaje</div><div class="value">${lead.message}</div></div>` : ""}
						<a href="https://casalia.org/admin/leads" class="cta">Ver en Panel Admin</a>
					</div>
				</div>
			</body>
			</html>
		`,
	}),

	/**
	 * Valuation request notification
	 */
	valuationRequest: (data: {
		name: string;
		email: string;
		phone: string;
		propertyType: string;
		address: string;
		area: number;
	}) => ({
		subject: `Solicitud de valoracion: ${data.address}`,
		html: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
					.content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
					.field { margin-bottom: 16px; }
					.label { font-weight: 600; color: #6b7280; font-size: 14px; }
					.value { margin-top: 4px; }
					.cta { display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1 style="margin:0;">Solicitud de Valoracion</h1>
					</div>
					<div class="content">
						<div class="field">
							<div class="label">Contacto</div>
							<div class="value">${data.name} - ${data.phone} - ${data.email}</div>
						</div>
						<div class="field">
							<div class="label">Tipo de inmueble</div>
							<div class="value">${data.propertyType}</div>
						</div>
						<div class="field">
							<div class="label">Direccion</div>
							<div class="value">${data.address}</div>
						</div>
						<div class="field">
							<div class="label">Superficie</div>
							<div class="value">${data.area} m²</div>
						</div>
						<a href="https://casalia.org/admin/leads" class="cta">Ver en Panel Admin</a>
					</div>
				</div>
			</body>
			</html>
		`,
	}),
};
