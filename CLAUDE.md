# Casalia 2.0 - Instrucciones del Proyecto

## Stack Tecnologico

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui (estilo new-york, base zinc)
- **Styling**: Tailwind CSS v4
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Linter/Formatter**: Biome + Ultracite
- **Testing**: bun-test
- **Package Manager**: bun

## Comandos

```bash
bun run dev          # Desarrollo con Turbopack
bun run build        # Build de produccion
bun run lint         # Verificar codigo con Biome
bun run lint:fix     # Arreglar problemas automaticamente
bun run format       # Formatear codigo
bun run test         # Ejecutar tests
bun run test:watch   # Tests en modo watch
bun run test:coverage # Tests con coverage
```

## Estructura del Proyecto

```
src/
  app/           # App Router pages
  components/    # Componentes React
    ui/          # Componentes shadcn/ui
  lib/           # Utilidades y helpers
  hooks/         # Custom hooks
__tests__/       # Tests con bun-test
  components/    # Tests de componentes
```

## Reglas de Codigo

### TypeScript
- **PROHIBIDO** usar `any` - usar `unknown` y type guards
- Tipado estricto habilitado (strict: true)
- Validar datos externos con Zod o type guards

### Imports
- Usar alias `@/` para imports desde src/
- Phosphor Icons: importar con sufijo Icon (`UserIcon`, `HouseIcon`)
- Para Server Components: usar `@phosphor-icons/react/ssr`

### Componentes
- Preferir Server Components por defecto
- Usar `"use client"` solo cuando sea necesario
- Componentes shadcn en `src/components/ui/`

### Testing
- Tests en `__tests__/` con extension `.test.ts` o `.test.tsx`
- Usar `describe`, `test`, `expect` de `bun:test`

## Agregar Componentes shadcn

```bash
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add input
```

## Documentacion del Proyecto

| Documento | Ubicacion | Contenido |
|-----------|-----------|-----------|
| **WORKPLAN.md** | `./WORKPLAN.md` | Plan de trabajo con todas las fases y tareas |
| **PRD** | `~/casalia-docs/PRD-Casalia-2.0.md` | Requisitos del producto |
| **Spec Tecnica** | `~/casalia-docs/TECHNICAL-SPEC-Casalia-2.0.md` | Especificacion tecnica completa |

## Notas

- El proyecto es para una inmobiliaria (Casalia)
- Web publica + Panel de administracion (backoffice)
- Integraciones con Idealista y Fotocasa
- Base de datos en Supabase con Drizzle ORM

## Estado Actual

**Fase 0 (Setup):** Completada
**Proxima fase:** Fase 1 - Infraestructura Base (Supabase + Drizzle)
