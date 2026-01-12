export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			appointments: {
				Row: {
					agent_id: string | null;
					created_at: string;
					id: string;
					lead_id: string | null;
					notes: string | null;
					property_id: string | null;
					scheduled_at: string;
					status: Database["public"]["Enums"]["appointment_status"];
				};
				Insert: {
					agent_id?: string | null;
					created_at?: string;
					id?: string;
					lead_id?: string | null;
					notes?: string | null;
					property_id?: string | null;
					scheduled_at: string;
					status?: Database["public"]["Enums"]["appointment_status"];
				};
				Update: {
					agent_id?: string | null;
					created_at?: string;
					id?: string;
					lead_id?: string | null;
					notes?: string | null;
					property_id?: string | null;
					scheduled_at?: string;
					status?: Database["public"]["Enums"]["appointment_status"];
				};
				Relationships: [
					{
						foreignKeyName: "appointments_agent_id_users_id_fk";
						columns: ["agent_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "appointments_lead_id_leads_id_fk";
						columns: ["lead_id"];
						isOneToOne: false;
						referencedRelation: "leads";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "appointments_property_id_properties_id_fk";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					},
				];
			};
			leads: {
				Row: {
					assigned_to: string | null;
					created_at: string;
					email: string | null;
					id: string;
					message: string | null;
					name: string;
					notes: string | null;
					phone: string | null;
					property_id: string | null;
					source: Database["public"]["Enums"]["lead_source"];
					status: Database["public"]["Enums"]["lead_status"];
					updated_at: string;
				};
				Insert: {
					assigned_to?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					message?: string | null;
					name: string;
					notes?: string | null;
					phone?: string | null;
					property_id?: string | null;
					source?: Database["public"]["Enums"]["lead_source"];
					status?: Database["public"]["Enums"]["lead_status"];
					updated_at?: string;
				};
				Update: {
					assigned_to?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					message?: string | null;
					name?: string;
					notes?: string | null;
					phone?: string | null;
					property_id?: string | null;
					source?: Database["public"]["Enums"]["lead_source"];
					status?: Database["public"]["Enums"]["lead_status"];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "leads_assigned_to_users_id_fk";
						columns: ["assigned_to"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "leads_property_id_properties_id_fk";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					},
				];
			};
			posts: {
				Row: {
					author_id: string | null;
					category: string | null;
					content: string;
					created_at: string;
					excerpt: string | null;
					featured_image: string | null;
					id: string;
					published_at: string | null;
					slug: string;
					status: Database["public"]["Enums"]["post_status"];
					title: string;
					updated_at: string;
				};
				Insert: {
					author_id?: string | null;
					category?: string | null;
					content: string;
					created_at?: string;
					excerpt?: string | null;
					featured_image?: string | null;
					id?: string;
					published_at?: string | null;
					slug: string;
					status?: Database["public"]["Enums"]["post_status"];
					title: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string | null;
					category?: string | null;
					content?: string;
					created_at?: string;
					excerpt?: string | null;
					featured_image?: string | null;
					id?: string;
					published_at?: string | null;
					slug?: string;
					status?: Database["public"]["Enums"]["post_status"];
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "posts_author_id_users_id_fk";
						columns: ["author_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			properties: {
				Row: {
					address: string | null;
					bathrooms: number | null;
					bedrooms: number | null;
					community_fee: number | null;
					created_at: string;
					created_by: string | null;
					description: string;
					energy_certificate:
						| Database["public"]["Enums"]["energy_certificate"]
						| null;
					features: Json | null;
					floor: string | null;
					fotocasa_id: string | null;
					has_air_conditioning: boolean | null;
					has_elevator: boolean | null;
					has_parking: boolean | null;
					has_pool: boolean | null;
					has_terrace: boolean | null;
					id: string;
					idealista_id: string | null;
					is_highlighted: boolean | null;
					lat: number | null;
					lng: number | null;
					operation_type: Database["public"]["Enums"]["operation_type"];
					price: number;
					price_per_sqm: number | null;
					property_type: Database["public"]["Enums"]["property_type"];
					published_at: string | null;
					slug: string;
					sqm_built: number | null;
					sqm_useful: number | null;
					status: Database["public"]["Enums"]["property_status"];
					sync_fotocasa: boolean | null;
					sync_idealista: boolean | null;
					title: string;
					tour_360_url: string | null;
					updated_at: string;
					year_built: number | null;
					zone: string | null;
				};
				Insert: {
					address?: string | null;
					bathrooms?: number | null;
					bedrooms?: number | null;
					community_fee?: number | null;
					created_at?: string;
					created_by?: string | null;
					description: string;
					energy_certificate?:
						| Database["public"]["Enums"]["energy_certificate"]
						| null;
					features?: Json | null;
					floor?: string | null;
					fotocasa_id?: string | null;
					has_air_conditioning?: boolean | null;
					has_elevator?: boolean | null;
					has_parking?: boolean | null;
					has_pool?: boolean | null;
					has_terrace?: boolean | null;
					id?: string;
					idealista_id?: string | null;
					is_highlighted?: boolean | null;
					lat?: number | null;
					lng?: number | null;
					operation_type: Database["public"]["Enums"]["operation_type"];
					price: number;
					price_per_sqm?: number | null;
					property_type: Database["public"]["Enums"]["property_type"];
					published_at?: string | null;
					slug: string;
					sqm_built?: number | null;
					sqm_useful?: number | null;
					status?: Database["public"]["Enums"]["property_status"];
					sync_fotocasa?: boolean | null;
					sync_idealista?: boolean | null;
					title: string;
					tour_360_url?: string | null;
					updated_at?: string;
					year_built?: number | null;
					zone?: string | null;
				};
				Update: {
					address?: string | null;
					bathrooms?: number | null;
					bedrooms?: number | null;
					community_fee?: number | null;
					created_at?: string;
					created_by?: string | null;
					description?: string;
					energy_certificate?:
						| Database["public"]["Enums"]["energy_certificate"]
						| null;
					features?: Json | null;
					floor?: string | null;
					fotocasa_id?: string | null;
					has_air_conditioning?: boolean | null;
					has_elevator?: boolean | null;
					has_parking?: boolean | null;
					has_pool?: boolean | null;
					has_terrace?: boolean | null;
					id?: string;
					idealista_id?: string | null;
					is_highlighted?: boolean | null;
					lat?: number | null;
					lng?: number | null;
					operation_type?: Database["public"]["Enums"]["operation_type"];
					price?: number;
					price_per_sqm?: number | null;
					property_type?: Database["public"]["Enums"]["property_type"];
					published_at?: string | null;
					slug?: string;
					sqm_built?: number | null;
					sqm_useful?: number | null;
					status?: Database["public"]["Enums"]["property_status"];
					sync_fotocasa?: boolean | null;
					sync_idealista?: boolean | null;
					title?: string;
					tour_360_url?: string | null;
					updated_at?: string;
					year_built?: number | null;
					zone?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "properties_created_by_users_id_fk";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			property_images: {
				Row: {
					created_at: string;
					id: string;
					is_primary: boolean | null;
					order: number;
					property_id: string;
					url: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					is_primary?: boolean | null;
					order?: number;
					property_id: string;
					url: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					is_primary?: boolean | null;
					order?: number;
					property_id?: string;
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "property_images_property_id_properties_id_fk";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					},
				];
			};
			sync_logs: {
				Row: {
					action: string;
					created_at: string;
					error_message: string | null;
					id: string;
					portal: string;
					property_id: string;
					response: Json | null;
					success: boolean;
				};
				Insert: {
					action: string;
					created_at?: string;
					error_message?: string | null;
					id?: string;
					portal: string;
					property_id: string;
					response?: Json | null;
					success: boolean;
				};
				Update: {
					action?: string;
					created_at?: string;
					error_message?: string | null;
					id?: string;
					portal?: string;
					property_id?: string;
					response?: Json | null;
					success?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: "sync_logs_property_id_properties_id_fk";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					},
				];
			};
			users: {
				Row: {
					avatar_url: string | null;
					created_at: string;
					email: string;
					id: string;
					name: string;
					role: Database["public"]["Enums"]["user_role"];
					updated_at: string;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string;
					email: string;
					id?: string;
					name: string;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string;
					email?: string;
					id?: string;
					name?: string;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			appointment_status: "programada" | "completada" | "cancelada";
			energy_certificate:
				| "A"
				| "B"
				| "C"
				| "D"
				| "E"
				| "F"
				| "G"
				| "en_tramite"
				| "exento";
			lead_source:
				| "web"
				| "idealista"
				| "fotocasa"
				| "whatsapp"
				| "telefono"
				| "presencial";
			lead_status: "nuevo" | "contactado" | "visita" | "cerrado" | "descartado";
			operation_type: "venta" | "alquiler";
			post_status: "borrador" | "publicado";
			property_status: "disponible" | "reservado" | "vendido" | "alquilado";
			property_type:
				| "piso"
				| "casa"
				| "terreno"
				| "local"
				| "garaje"
				| "trastero";
			user_role: "admin" | "agent";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			appointment_status: ["programada", "completada", "cancelada"],
			energy_certificate: [
				"A",
				"B",
				"C",
				"D",
				"E",
				"F",
				"G",
				"en_tramite",
				"exento",
			],
			lead_source: [
				"web",
				"idealista",
				"fotocasa",
				"whatsapp",
				"telefono",
				"presencial",
			],
			lead_status: ["nuevo", "contactado", "visita", "cerrado", "descartado"],
			operation_type: ["venta", "alquiler"],
			post_status: ["borrador", "publicado"],
			property_status: ["disponible", "reservado", "vendido", "alquilado"],
			property_type: ["piso", "casa", "terreno", "local", "garaje", "trastero"],
			user_role: ["admin", "agent"],
		},
	},
} as const;
