# Database Schema Backup - Casalia 2.0

## Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'agent');
CREATE TYPE property_type AS ENUM ('piso', 'casa', 'terreno', 'local', 'garaje', 'trastero');
CREATE TYPE operation_type AS ENUM ('venta', 'alquiler');
CREATE TYPE property_status AS ENUM ('disponible', 'reservado', 'vendido', 'alquilado');
CREATE TYPE lead_status AS ENUM ('nuevo', 'contactado', 'visita', 'cerrado', 'descartado');
CREATE TYPE lead_source AS ENUM ('web', 'idealista', 'fotocasa', 'whatsapp', 'telefono', 'presencial', 'valoracion');
CREATE TYPE post_status AS ENUM ('borrador', 'publicado');
CREATE TYPE appointment_status AS ENUM ('programada', 'completada', 'cancelada');
CREATE TYPE energy_certificate AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'en_tramite', 'exento');
CREATE TYPE column_type AS ENUM ('text', 'number', 'date', 'checkbox', 'file', 'link', 'dropdown');
```

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'agent',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### properties
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  price_per_sqm DECIMAL(10, 2),
  sqm_built INTEGER,
  sqm_useful INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  zone VARCHAR(255),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  year_built INTEGER,
  energy_certificate energy_certificate,
  property_type property_type NOT NULL,
  operation_type operation_type NOT NULL,
  status property_status NOT NULL DEFAULT 'disponible',
  features JSONB,
  community_fee DECIMAL(8, 2),
  floor VARCHAR(50),
  has_elevator BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT FALSE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_air_conditioning BOOLEAN DEFAULT FALSE,
  tour_360_url TEXT,
  is_highlighted BOOLEAN DEFAULT FALSE,
  sync_idealista BOOLEAN DEFAULT FALSE,
  sync_fotocasa BOOLEAN DEFAULT FALSE,
  idealista_id VARCHAR(100),
  fotocasa_id VARCHAR(100),
  created_by UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### property_images
```sql
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  source lead_source NOT NULL DEFAULT 'web',
  status lead_status NOT NULL DEFAULT 'nuevo',
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  status appointment_status NOT NULL DEFAULT 'programada',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### posts
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(100),
  status post_status NOT NULL DEFAULT 'borrador',
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### sync_logs
```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  portal VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL,
  response JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### custom_tables
```sql
CREATE TABLE custom_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### custom_columns
```sql
CREATE TABLE custom_columns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES custom_tables(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  column_type column_type NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL DEFAULT 0,
  options JSONB,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### custom_rows
```sql
CREATE TABLE custom_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES custom_tables(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## User in auth.users (Supabase Auth)

El usuario de prueba existe en Supabase Auth:
- ID: `d1e499a3-5ee1-4427-a8ba-cdc283782244`
- Email: `testcasalia@casalia.org`
- Role: `admin`
