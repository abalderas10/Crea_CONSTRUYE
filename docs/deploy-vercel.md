# Desplegar creaConstruye en Vercel

> **Tiempo estimado**: 20 minutos (incluyendo crear cuentas si hace falta).
> **Costo**: $0 (Vercel hobby es gratis; Supabase free tier; Claude con pay-as-you-go).

---

## 1 · Prerrequisitos

Antes de empezar, ten a la mano:

- [ ] Acceso al repo `abalderas10/Crea_CONSTRUYE` en GitHub
- [ ] Una cuenta en [supabase.com](https://supabase.com)
- [ ] Una cuenta en [console.anthropic.com](https://console.anthropic.com) (con API key)
- [ ] Una cuenta en [vercel.com](https://vercel.com) (puedes entrar con GitHub)

---

## 2 · Configurar Supabase

### 2.1 · Crear el proyecto

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Nombre: `creaconstruye-prod` (o el que prefieras)
4. Database Password: genera una segura y **guárdala** (1Password, Bitwarden, etc.)
5. Region: **South America (São Paulo)** — más cercano a México y a la región Vercel `gru1`
6. Click **"Create new project"** (~2 minutos)

### 2.2 · Obtener las API keys

1. En el dashboard, ve a **Project Settings → API**
2. Copia estos dos valores:

   | Nombre | Variable de entorno |
   |---|---|
   | **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
   | **Publishable key** (`sb_publishable_...`) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

   > La publishable key es la convención nueva (2025+). Si tu proyecto es
   > anterior, usa la **anon key legacy** (empieza con `eyJ...`) en
   > `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2.3 · Aplicar las migraciones

Tienes 9 migraciones SQL en `creaconstruye/supabase/migrations/` (de `0001_init.sql`
hasta `0008_interest_signups.sql`).

**Opción A — desde el SQL Editor del dashboard (recomendado para producción):**

1. En Supabase, ve a **SQL Editor**
2. Click **"New query"**
3. Copia el contenido de cada migración **en orden** (`0001` → `0002` → ... → `0008`)
4. Pega y ejecuta cada una

**Opción B — desde la CLI de Supabase** (requiere instalar `supabase` CLI):

```bash
supabase link --project-ref <tu-project-ref>
supabase db push
```

### 2.4 · Configurar Auth

1. En Supabase, ve a **Authentication → URL Configuration**
2. Agrega estas URLs:
   - **Site URL**: `https://creaconstruye.abdev.click`
   - **Redirect URLs** (una por línea):
     - `https://creaconstruye.abdev.click/auth/callback`
     - `https://creaconstruye.abdev.click/actualizar-password`

### 2.5 · (Opcional) Habilitar Google OAuth

1. **Authentication → Providers → Google**
2. Activa **"Enable Sign in with Google"**
3. Sigue las instrucciones para crear OAuth credentials en [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Pega Client ID y Client Secret en Supabase
5. Agrega `https://creaconstruye.abdev.click/auth/callback` como Authorized Redirect URI en Google Cloud

---

## 3 · Obtener Anthropic API key

1. Entra a [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Click **"Create Key"**
3. Nombre: `creaconstruye-prod`
4. Copia el valor (empieza con `sk-ant-api03-...`) — **solo lo verás una vez**
5. **Configura un límite de gasto**: Settings → Billing → Set Monthly Limit
   - Sugerido para empezar: **$20–50 USD/mes**
   - El modelo usado es `claude-opus-4-8` (configurable en `src/lib/ai/*.ts`)

---

## 4 · Desplegar en Vercel

### 4.1 · Crear el proyecto Vercel

1. Entra a [vercel.com/new](https://vercel.com/new)
2. Click **"Import"** junto a `abalderas10/Crea_CONSTRUYE`
3. **Project Name**: `creaconstruye`
4. **Framework Preset**: Next.js (detectado automáticamente)
5. **Root Directory**: `creaconstruye` ⚠️ IMPORTANTE
6. **Build Command**: dejar default (`npm run build`)
7. **Install Command**: cambiar a `bun install` (más rápido, evita bug de npm con deps nativas Windows)

### 4.2 · Variables de entorno en Vercel

En la sección **"Environment Variables"**, agrega:

| Variable | Valor | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | tu URL de Supabase | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | tu publishable key | Production, Preview, Development |
| `ANTHROPIC_API_KEY` | tu Anthropic API key | Production, Preview, Development |

> ⚠️ Marca la casilla **"Sensitive"** para `ANTHROPIC_API_KEY`.

Click **"Deploy"**. El primer build toma 2-3 minutos.

### 4.3 · Configurar el dominio personalizado `creaconstruye.abdev.click`

Una vez completado el primer deploy:

1. En el dashboard de Vercel, ve a **Settings → Domains**
2. Click **"Add"**
3. Escribe: `creaconstruye.abdev.click`
4. Vercel te dirá qué registros DNS agregar

**En tu proveedor DNS de `abdev.click`** (Cloudflare, Porkbun, Namecheap, etc.):

```
Tipo    Nombre                              Valor
───── ──────────────────────────────── ─────────────────────────────────────
CNAME  creaconstruye                      cname.vercel-dns.com
```

(Si tu DNS no soporta CNAME en apex, usa ALIAS o ANAME — Vercel detecta
automáticamente.)

5. Espera la propagación (5-30 minutos)
6. Vercel agregará el certificado SSL automáticamente (Let's Encrypt)

> **Una vez configurado el dominio**: actualiza las URLs en Supabase Auth
> (paso 2.4) para que apunten a `creaconstruye.abdev.click` en lugar de
> `localhost`.

---

## 5 · Verificación post-despliegue

Checklist para confirmar que todo funciona:

- [ ] `https://creaconstruye.abdev.click` carga la landing (sin errores en consola)
- [ ] Botón "Evalúa tu primer terreno" redirige a `/registro`
- [ ] El registro crea un usuario en Supabase (visible en Dashboard → Authentication)
- [ ] Después de registrar, redirige a `/app`
- [ ] Crear un proyecto funciona (visible en Supabase → Table Editor → projects)
- [ ] Llenar la herramienta Terreno y hacer click en "Generar análisis" produce una respuesta de Claude en ~5-10 segundos
- [ ] El análisis se guarda y aparece al recargar la página
- [ ] Descargar el PDF de Proforma Completa produce un PDF válido (no error 500)
- [ ] El admin (si tienes `is_admin: true` en tu perfil) puede ver `/app/admin`
- [ ] Los leads de `/constructiva` llegan a la bandeja admin

### Cómo darte permisos de admin

En Supabase → SQL Editor:

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'tu@correo.com');
```

---

## 6 · Configuración opcional (post-MVP)

### Emails transaccionales con Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio `abdev.click` (Settings → Domains → Add)
3. Crear API key en [resend.com/api-keys](https://resend.com/api-keys)
4. Agregar a Vercel: `RESEND_API_KEY=re_...`

### Stripe (suscripciones)

1. Crear cuenta en [dashboard.stripe.com](https://dashboard.stripe.com)
2. Activar modo Live cuando estés listo
3. Obtener API keys (Standard → Restricted):
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Configurar webhook: `STRIPE_WEBHOOK_SECRET`
5. Crear productos y precios en Stripe Dashboard

---

## 7 · Costos mensuales estimados

| Servicio | Plan | Costo |
|---|---|---|
| Vercel | Hobby | $0 |
| Supabase | Free (hasta 500 MB DB, 50k auth users) | $0 |
| Anthropic Claude | Pay-as-you-go | $5–50 (depende del uso) |
| Dominio `abdev.click` | (ya lo tienes) | $0 |
| **Total** | | **$5–50/mes** |

Cuando escales (>1000 usuarios activos), Supabase Pro son $25/mes y
Vercel Pro $20/mes.

---

## 8 · Rollback y monitoreo

- **Rollback**: en Vercel → Deployments → click en el deploy anterior → "Promote to Production"
- **Logs**: Vercel → Logs (en tiempo real) y Supabase → Logs
- **Errores**: (pendiente) integrar Sentry cuando se implemente Fase 4 del roadmap

---

## 9 · Variables de entorno — referencia rápida

| Variable | Dónde se obtiene | Requerida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | ✅ Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API → Publishable key | ✅ Sí |
| `ANTHROPIC_API_KEY` | console.anthropic.com → Settings → API Keys | ✅ Sí |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys | ⏸ Después |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Webhooks → Endpoint | ⏸ Después |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API keys | ⏸ Después |
| `RESEND_API_KEY` | resend.com → API Keys | ⏸ Después |

> Si dejas TODAS las variables vacías, la plataforma funciona en **modo
> demo** (un usuario simulado, sin Supabase, sin Claude). Útil para
> preview rápido sin gastar tokens.

---

*Última actualización: agosto 2026 · Alberto Balderas / ABDev*