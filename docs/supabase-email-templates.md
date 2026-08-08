# Configurar emails de Supabase con branding creaConstruye

> **Tiempo**: 10 minutos. **Costo**: $0.
> **Resultado**: los emails de confirmación, recuperación de contraseña y magic link dirán **creaConstruye** con tu branding, no "Supabase".

Por default, Supabase envía todos los emails con su template genérico que dice "Supabase Authentication". Para que digan **creaConstruye** (y tengan tu dominio), hay que personalizar los templates en el dashboard.

---

## 1 · Configurar el sender (remitente)

Antes de tocar los templates, configura el **From email** para que use tu dominio.

### Opción A — Usar el SMTP default de Supabase (rápido)

Solo cambia el "From" en cada template. El remitente será `noreply@mail.app.supabase.io` pero el "from name" lo controlas tú.

### Opción B — Custom SMTP (recomendado para producción)

1. En Supabase Dashboard → **Project Settings → Auth → SMTP**
2. Activa **"Enable Custom SMTP"**
3. Configura con tu proveedor favorito (recomendados):
   - **Resend** (https://resend.com) — 100 emails/día gratis, ideal para empezar
   - **SendGrid** — 100 emails/día gratis
   - **Amazon SES** — $0.10 por 1,000 emails
4. Verifica tu dominio (`abdev.click`) con los registros DNS que el proveedor te dé
5. En Supabase, pon el "From address" como `hola@creaconstruye.abdev.click` o `no-reply@creaconstruye.abdev.click`

---

## 2 · Personalizar los templates

Ve a **Authentication → Email Templates**. Hay 4 templates editables:

### 2.1 · Confirm signup (el que viste mal)

**Subject** (recomendado):
```
Confirma tu correo en creaConstruye
```

**Body** (Subject y Body se editan en dos campos separados; "Confirm signup" es el que se envía al registrarse):

```html
<h2>Bienvenido a creaConstruye</h2>
<p>Gracias por registrarte. Para activar tu cuenta y empezar a evaluar
proyectos inmobiliarios con datos reales de México, confirma tu correo:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;background:#c8ff00;color:#000;font-weight:700;text-decoration:none;border-radius:6px">Confirmar mi correo</a></p>

<p>O copia y pega este enlace en tu navegador:</p>
<p style="word-break:break-all;color:#52525b;font-size:12px">{{ .ConfirmationURL }}</p>

<p>El enlace expira en 24 horas. Si no creaste esta cuenta, ignora este
correo.</p>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0">

<p style="color:#52525b;font-size:12px">
creaConstruye — Plataforma mexicana de proforma inmobiliaria con IA.<br>
<a href="https://creaconstruye.abdev.click">creaconstruye.abdev.click</a>
</p>
```

**Importante**: las variables `{{ .ConfirmationURL }}` y `{{ .Email }}` son las únicas que Supabase reemplaza automáticamente. El resto es HTML puro.

### 2.2 · Magic Link (login sin contraseña)

**Subject**:
```
Tu enlace de acceso a creaConstruye
```

**Body**:
```html
<h2>Tu enlace de acceso</h2>
<p>Click en el botón para entrar a tu cuenta de creaConstruye:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;background:#c8ff00;color:#000;font-weight:700;text-decoration:none;border-radius:6px">Entrar a creaConstruye</a></p>

<p>El enlace expira en 1 hora. Si no lo solicitaste, ignora este correo.</p>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0">

<p style="color:#52525b;font-size:12px">
creaConstruye — Evaluación de proyectos inmobiliarios con datos reales de México.<br>
<a href="https://creaconstruye.abdev.click">creaconstruye.abdev.click</a>
</p>
```

### 2.3 · Reset password (recuperación)

**Subject**:
```
Restablece tu contraseña de creaConstruye
```

**Body**:
```html
<h2>Restablece tu contraseña</h2>
<p>Recibimos una solicitud para cambiar la contraseña de tu cuenta en
creaConstruye. Si no lo solicitaste, ignora este correo.</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;background:#c8ff00;color:#000;font-weight:700;text-decoration:none;border-radius:6px">Crear nueva contraseña</a></p>

<p>El enlace expira en 1 hora.</p>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0">

<p style="color:#52525b;font-size:12px">
creaConstruye — ¿Necesitas ayuda? Escríbenos a hola@creaconstruye.com.<br>
<a href="https://creaconstruye.abdev.click">creaconstruye.abdev.click</a>
</p>
```

### 2.4 · Email change (si el usuario cambia su correo)

**Subject**:
```
Confirma tu nuevo correo en creaConstruye
```

**Body**:
```html
<h2>Confirma tu nuevo correo</h2>
<p>Click para confirmar que <strong>{{ .Email }}</strong> es tu nuevo
correo en creaConstruye:</p>

<p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;background:#c8ff00;color:#000;font-weight:700;text-decoration:none;border-radius:6px">Confirmar nuevo correo</a></p>

<p>Si no solicitaste este cambio, ignora el correo.</p>

<hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0">

<p style="color:#52525b;font-size:12px">
creaConstruye · <a href="https://creaconstruye.abdev.click">creaconstruye.abdev.click</a>
</p>
```

---

## 3 · Verifica la configuración de URLs

Esto es crítico para que los links de los emails apunten a tu dominio, no a un preview deployment de Vercel.

Ve a **Authentication → URL Configuration**:

| Campo | Valor |
|---|---|
| **Site URL** | `https://creaconstruye.abdev.click` |
| **Redirect URLs** (una por línea) | `https://creaconstruye.abdev.click/auth/callback` |
| | `https://creaconstruye.abdev.click/actualizar-password` |

> ⚠️ **El error que viste del 404** (DEPLOYMENT_NOT_FOUND) suele pasar cuando Supabase tiene en cache un preview deployment. Después de actualizar Site URL y Redirect URLs, **pide a Supabase que reenvíe el email de confirmación** (botón "Resend" en Authentication → Users → tu usuario).

---

## 4 · Confirmar el partido en producción

Para verificar que todo funciona:

1. **Rota la `ANTHROPIC_API_KEY`** (ya lo hiciste ✓)
2. **Verifica que Supabase Auth tenga tu Site URL** apuntando al dominio apex (`creaconstruye.abdev.click` sin `www`)
3. **Pide a un usuario de prueba que se registre** y revisa el email
4. El email debe decir "creaConstruye" con tu branding
5. Click en el link debe ir a `creaconstruye.abdev.click/auth/callback?...` y luego a `/app` (no a un 404)

---

## 5 · Próximos pasos de email (post-MVP)

| Necesidad | Solución |
|---|---|
| **Email transaccional** (bienvenida, recordatorios, alertas de cambio normativo) | Resend (https://resend.com) — integrar en `lib/email/` |
| **Magic link** (login sin contraseña) | Ya está en los templates — solo actívalo en `Authentication → Sign In/Up → Magic Link` |
| **MFA** (autenticación de dos factores) | Authentication → MFA → TOTP — recomendado para usuarios con datos sensibles |
| **Plantillas localizadas** (es-MX, en-US) | Supabase no soporta multi-idioma en templates. Solución: detectar locale y elegir template en el código (`signIn` server action) |

---

## Lo que ya está en código (no tocar)

- `src/app/auth/callback/route.ts` — maneja el callback de OAuth, magic link, y errores (token expirado)
- `src/app/auth/actions.ts` — server actions para signIn, signUp, resetPassword, updatePassword, signOut, signInWithGoogle
- `src/components/auth/AuthShell.tsx` — el shell visual (logo, copy, dark/light)
- `src/components/auth/AuthForm.tsx` — el form con estados de loading y error

Si quieres un cambio en estos archivos, házmelo saber.

---

*Última actualización: agosto 2026 · ABDev*