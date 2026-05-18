# TRAKIA MVP — Planificación técnica

Sistema de operaciones para trabajadores de campo. Frontend React + TypeScript (build estático), backend PHP + MySQL. Hosteable en cualquier shared hosting con soporte PHP.

---

## Stack tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | React 18 + Vite + **TypeScript** | Vite compila TS → JS estático; tipos previenen bugs en tiempo de desarrollo |
| Routing | React Router v6 | Client-side routing; funciona con `.htaccess` en Apache |
| Estilos | Tailwind CSS v3 | Mismo sistema visual que la landing; JIT integrado en Vite |
| Mapas | Leaflet + react-leaflet | Open source, sin API key |
| Gráficos | Recharts | Liviano, nativo React, suficiente para dashboards |
| Backend | PHP 8.1+ | Universal en shared hosting |
| Base de datos | MySQL 8.x | Disponible en casi todo hosting compartido |
| Auth | JWT (HS256) | PHP genera el token; React lo guarda en `localStorage` |
| Upload | PHP nativo | SCTR, fotos de incidentes, documentos |

> **TypeScript y shared hosting:** Vite compila `.tsx/.ts` → `.js` puro durante `npm run build`. El servidor nunca ve TypeScript — solo archivos estáticos JS/CSS/HTML. 100% compatible con cualquier hosting.

**No se usa:** Next.js, SSR, Node en servidor, Composer (opcional), Docker.

**Requisitos mínimos de hosting:**
- PHP 8.0+ con extensiones: `pdo_mysql`, `gd`, `fileinfo`, `mbstring`
- MySQL 5.7+ / MariaDB 10.4+
- Apache con `mod_rewrite` y `.htaccess` habilitado
- 512 MB RAM mínimo

---

## Arquitectura

```
MVP/
├── frontend/                    ← Proyecto React + Vite + TypeScript
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx              ← Router raíz
│   │   ├── types/
│   │   │   └── index.ts         ← Interfaces: Worker, Checkin, Task, Incident, etc.
│   │   ├── data/
│   │   │   └── mock.ts          ← Datos hardcodeados para Fase 0 (mockup estático)
│   │   ├── api/
│   │   │   └── client.ts        ← fetch wrapper con JWT (usado desde Fase 1)
│   │   ├── components/
│   │   │   ├── ui/              ← StatCard, Badge, DataTable, Modal, etc.
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.tsx ← Sidebar + topbar
│   │   │   │   └── AuthLayout.tsx
│   │   │   └── maps/
│   │   │       └── CheckinMap.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveOps.tsx      ← Operaciones en campo en vivo
│   │   │   ├── workers/
│   │   │   ├── checkins/
│   │   │   ├── tasks/
│   │   │   ├── incidents/
│   │   │   ├── documents/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── hooks/               ← useAuth, useWorkers, useCheckins, etc.
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     ← API PHP
│   ├── api/
│   │   └── v1/
│   │       ├── index.php        ← Router + CORS headers
│   │       ├── auth.php
│   │       ├── workers.php
│   │       ├── checkins.php
│   │       ├── tasks.php
│   │       ├── incidents.php
│   │       ├── documents.php
│   │       └── reports.php
│   ├── src/
│   │   ├── Core/
│   │   │   ├── DB.php           ← PDO singleton
│   │   │   ├── Auth.php         ← JWT verify + helpers de rol
│   │   │   └── Response.php     ← json_response(), error()
│   │   └── Models/
│   │       ├── Company.php
│   │       ├── User.php
│   │       ├── Worker.php
│   │       ├── Checkin.php
│   │       ├── Task.php
│   │       ├── Incident.php
│   │       └── Document.php
│   ├── config/
│   │   └── database.php         ← Credenciales (en .gitignore)
│   ├── storage/
│   │   └── uploads/             ← Fotos e incidentes (permisos 755)
│   └── database/
│       ├── schema.sql
│       └── seed.sql
│
└── dist/                        ← Output de `npm run build` (se sube al host)
    ├── index.html
    ├── assets/
    └── .htaccess                ← Redirige rutas React + pasa /api/ al PHP
```

### Flujo de una petición

```
Navegador (React) → fetch /api/v1/workers
                         ↓
                   backend/api/v1/index.php
                         ↓
                   Router PHP → Controller → Model → MySQL
                         ↓
                   JSON response
                         ↓
                   React actualiza estado → re-render
```

### .htaccess en la raíz del hosting

```apache
RewriteEngine On
RewriteBase /

# Las llamadas a /api/ van directo al PHP
RewriteRule ^api/ - [L]

# Todo lo demás → React app (client-side routing)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## Roles y permisos

| Rol | Acceso |
|---|---|
| `admin` | Todo. Gestiona empresa, usuarios, workers, reportes |
| `supervisor` | Asigna tareas, ve dashboard, registra/revisa incidentes, valida check-ins |
| `worker` | Solo API móvil: check-in/out, tareas propias, reportar incidentes |

El JWT incluye `{ id, company_id, rol }`. El backend verifica el rol en cada endpoint.

---

## Base de datos

### Diagrama de tablas

```
companies ──< users
companies ──< workers ──< worker_documents
companies ──< sites
companies ──< tasks ──< task_assignments >── workers
workers   ──< checkins >── sites
workers   ──< incidents >── sites
```

### Schema SQL

```sql
-- Empresas cliente
CREATE TABLE companies (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(150) NOT NULL,
  ruc          VARCHAR(11) UNIQUE NOT NULL,
  plan         ENUM('base','premium') DEFAULT 'base',
  activo       TINYINT(1) DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios del panel web (admins y supervisores)
CREATE TABLE users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id   INT UNSIGNED NOT NULL,
  nombre       VARCHAR(120) NOT NULL,
  email        VARCHAR(120) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  rol          ENUM('admin','supervisor') DEFAULT 'supervisor',
  activo       TINYINT(1) DEFAULT 1,
  last_login   DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Trabajadores de campo (usan la app móvil, no el panel)
CREATE TABLE workers (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id   INT UNSIGNED NOT NULL,
  nombre       VARCHAR(120) NOT NULL,
  dni          VARCHAR(12) NOT NULL,
  telefono     VARCHAR(20),
  cargo        VARCHAR(80),
  activo       TINYINT(1) DEFAULT 1,
  pin          VARCHAR(6),                  -- PIN para login en app básica
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_worker_company_dni (company_id, dni),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Sedes / obras / plantas
CREATE TABLE sites (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id   INT UNSIGNED NOT NULL,
  nombre       VARCHAR(120) NOT NULL,
  direccion    VARCHAR(200),
  lat          DECIMAL(10,7),
  lng          DECIMAL(10,7),
  radio_metros INT DEFAULT 100,             -- geofence para validar check-in
  activo       TINYINT(1) DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Check-in y check-out con GPS
CREATE TABLE checkins (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  worker_id    INT UNSIGNED NOT NULL,
  site_id      INT UNSIGNED,
  tipo         ENUM('entrada','salida') NOT NULL,
  lat          DECIMAL(10,7),
  lng          DECIMAL(10,7),
  offline_ts   DATETIME,                   -- timestamp capturado offline en el dispositivo
  synced_at    DATETIME,                   -- cuando llegó al servidor
  nota         TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Tareas
CREATE TABLE tasks (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id    INT UNSIGNED NOT NULL,
  site_id       INT UNSIGNED,
  supervisor_id INT UNSIGNED NOT NULL,
  titulo        VARCHAR(200) NOT NULL,
  descripcion   TEXT,
  fecha         DATE NOT NULL,
  prioridad     ENUM('baja','normal','alta') DEFAULT 'normal',
  estado        ENUM('pendiente','en_progreso','completada','problema') DEFAULT 'pendiente',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (supervisor_id) REFERENCES users(id)
);

-- Asignación de tareas a trabajadores
CREATE TABLE task_assignments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id       INT UNSIGNED NOT NULL,
  worker_id     INT UNSIGNED NOT NULL,
  estado        ENUM('pendiente','completada','problema') DEFAULT 'pendiente',
  nota_worker   TEXT,
  foto          VARCHAR(255),
  completada_at DATETIME,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (worker_id) REFERENCES workers(id)
);

-- Incidentes reportados
CREATE TABLE incidents (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id   INT UNSIGNED NOT NULL,
  worker_id    INT UNSIGNED NOT NULL,
  site_id      INT UNSIGNED,
  descripcion  TEXT NOT NULL,
  foto         VARCHAR(255),
  lat          DECIMAL(10,7),
  lng          DECIMAL(10,7),
  severidad    ENUM('bajo','medio','alto','critico') DEFAULT 'medio',
  estado       ENUM('abierto','en_revision','cerrado') DEFAULT 'abierto',
  revisado_por INT UNSIGNED,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

-- Documentos del trabajador (SCTR, examen médico, certificados)
CREATE TABLE worker_documents (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  worker_id    INT UNSIGNED NOT NULL,
  tipo         ENUM('sctr','examen_medico','certificado','contrato','otro') NOT NULL,
  nombre       VARCHAR(120),
  archivo      VARCHAR(255) NOT NULL,
  vencimiento  DATE,
  alerta_enviada TINYINT(1) DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES workers(id)
);
```

---

## Interfaces a construir

### Panel web (supervisores y admin)

| Pantalla | Ruta | Descripción |
|---|---|---|
| Login | `/login` | Email + password; guarda JWT en localStorage |
| Dashboard | `/` | KPIs del día: presentes, ausentes, incidentes abiertos, tareas completadas |
| Trabajadores | `/workers` | Listado con búsqueda, badge activo/inactivo, alerta de documentos vencidos |
| Nuevo trabajador | `/workers/new` | Formulario de alta: nombre, DNI, cargo, sede asignada, PIN |
| Perfil trabajador | `/workers/:id` | Historial de check-ins, tareas asignadas, incidentes, documentos |
| Check-ins hoy | `/checkins` | Tabla en tiempo real + mapa Leaflet con pins de ubicación |
| Tareas | `/tasks` | Kanban: pendiente / en progreso / completada / problema |
| Nueva tarea | `/tasks/new` | Formulario: título, sede, fecha, prioridad, asignación múltiple de workers |
| Operaciones en vivo | `/live` | Mapa en tiempo real con todos los workers activos, incidentes abiertos y estado de tareas del turno |
| Incidentes | `/incidents` | Listado con filtro por severidad y estado; foto en modal; pin en mapa |
| Nuevo incidente | `/incidents/new` | Formulario de registro: worker, sede, descripción, severidad, foto, GPS |
| Detalle incidente | `/incidents/:id` | Vista completa: datos, foto, mapa, historial de estado, campo de revisión |
| Documentos | `/documents` | Vista agrupada de documentos próximos a vencer: 30 / 15 / 7 días |
| Reportes | `/reports` | Selector de rango de fechas + exportar asistencia a CSV formato PLAME |
| Config empresa | `/settings` | Datos empresa, sedes/obras, gestión de usuarios supervisores |

### Componentes de UI reutilizables (`src/components/ui/`)

| Componente | Uso |
|---|---|
| `StatCard` | KPI con número grande, etiqueta y delta de tendencia |
| `Badge` | Estado coloreado: verde / ámbar / rojo / azul |
| `DataTable` | Tabla con búsqueda, paginación y loading skeleton |
| `Modal` | Overlay para confirmaciones y formularios rápidos |
| `AlertBanner` | Aviso de documentos por vencer, incidentes críticos |
| `PageHeader` | Título de sección + breadcrumb + botón de acción |
| `EmptyState` | Ilustración + CTA cuando no hay datos |
| `FileUpload` | Drag & drop de foto/documento con preview |

### Estilo visual (consistente con la landing)

```
Colores:
  Primario:   #175CD3
  Navy:       #101828
  Slate:      #475467
  Muted:      #667085
  Borde:      #E4E7EC
  Fondo:      #F8FAFC

Tipografía:
  Headings:   Sora (700)
  Body:       Source Sans 3 (400/500/600)
  Mono/datos: IBM Plex Mono

Radios:   8px (botones, cards)
Sombra:   0 1px 3px rgba(16,24,40,0.08)
```

Configurar en `tailwind.config.js` como tema extendido para usar `font-sora`, `font-sans`, `font-mono` en clases.

---

## API REST (PHP)

Base: `https://dominio.com/api/v1/`  
Todos los endpoints devuelven: `{ "ok": true, "data": {}, "error": null }`  
Endpoints protegidos requieren: `Authorization: Bearer {jwt}`

### Auth
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/login` | Login supervisor/admin → devuelve JWT |
| POST | `/auth/worker-login` | Login worker por DNI + PIN → JWT para app móvil |
| GET | `/auth/me` | Datos del usuario autenticado |

### Workers
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/workers` | Listado de workers de la empresa |
| POST | `/workers` | Crear worker |
| GET | `/workers/:id` | Detalle + historial |
| PUT | `/workers/:id` | Actualizar |
| DELETE | `/workers/:id` | Desactivar (soft delete) |

### Check-ins
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/checkins` | Listado con filtros de fecha y worker |
| POST | `/checkins` | Registrar check-in (acepta array para sync offline) |
| GET | `/checkins/today` | Check-ins del día actual para el dashboard |

### Tareas
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/tasks` | Listado con filtro de fecha/estado |
| POST | `/tasks` | Crear tarea con asignaciones |
| PATCH | `/tasks/:id` | Actualizar estado |
| DELETE | `/tasks/:id` | Eliminar tarea |
| PATCH | `/tasks/:id/assignments/:worker_id` | Worker actualiza su asignación |

### Incidentes
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/incidents` | Listado con filtros |
| POST | `/incidents` | Crear incidente (multipart/form-data con foto) |
| GET | `/incidents/:id` | Detalle completo |
| PATCH | `/incidents/:id` | Actualizar estado / agregar revisión |

### Documentos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/documents` | Documentos próximos a vencer |
| POST | `/documents` | Subir documento para un worker (multipart) |
| DELETE | `/documents/:id` | Eliminar documento |

### Reportes
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/reports/plame?from=&to=` | CSV de asistencia en formato PLAME |
| GET | `/reports/summary` | Resumen ejecutivo del período |

---

## Roadmap

### Fase 0 — Mockup estático (datos hardcodeados)
> Objetivo: UI completa navegable sin backend ni base de datos. Sirve para validar flujos con usuarios reales antes de escribir una línea de PHP.

Todo el estado viene de `src/data/mock.ts` — un objeto TypeScript con arrays de workers, checkins, tareas e incidentes ficticios. Las páginas leen de ahí directamente, sin fetch ni API.

```
[ ] Setup: Vite + React 18 + TypeScript + Tailwind + React Router
[ ] Tipos base en src/types/index.ts (Worker, Checkin, Task, Incident, Document, Site)
[ ] Datos mock en src/data/mock.ts
[ ] AppShell: sidebar, topbar, navegación entre secciones
[ ] Layout de autenticación (pantalla login — sin lógica real, solo UI)
[ ] Dashboard: KPIs del día con datos mock + gráfico de asistencia semanal
[ ] Operaciones en vivo (/live): mapa Leaflet con pins de workers + panel lateral de alertas
[ ] Trabajadores (/workers): tabla con búsqueda y filtros + badges de estado
[ ] Perfil trabajador (/workers/:id): historial mock de check-ins, tareas, documentos
[ ] Check-ins (/checkins): tabla del día + mapa de ubicaciones
[ ] Tareas (/tasks): kanban con drag visual (o columnas sin drag para MVP)
[ ] Incidentes (/incidents): listado + nuevo incidente (formulario sin submit real) + detalle
[ ] Documentos (/documents): vista de vencimientos agrupados por urgencia
[ ] Reportes (/reports): selector de fechas + tabla de preview + botón de exportar (mock)
[ ] Settings (/settings): formulario de empresa y sedes (solo UI)
[ ] Responsive: sidebar colapsable en móvil, tablas con scroll horizontal
```

**Criterio de salida de Fase 0:** se puede hacer un demo completo del flujo del supervisor sin que ningún botón falle. Si un usuario de prueba entiende el producto navegando el mockup → pasar a Fase 1.

---

### Fase 1 — Backend real (PHP + MySQL)
> Objetivo: reemplazar `mock.ts` por llamadas reales a la API. La UI no cambia.

La estrategia es que cada hook (`useWorkers`, `useCheckins`, etc.) tenga un flag `USE_MOCK` en Fase 0. En Fase 1 se apaga ese flag y el hook pasa a llamar a `api/client.ts`.

```
[ ] Estructura de carpetas PHP + PDO singleton + Response helper
[ ] Schema SQL completo + seed con datos de demo
[ ] Auth: POST /auth/login → JWT; ProtectedRoute en React usa token real
[ ] API /workers: GET lista, POST crear, GET :id, PUT actualizar, DELETE desactivar
[ ] API /checkins: GET con filtros, POST (acepta batch offline), GET /today
[ ] API /tasks: CRUD completo + PATCH de asignación por worker
[ ] API /incidents: GET lista, POST con foto (multipart), PATCH estado
[ ] API /documents: GET por vencimiento, POST upload, DELETE
[ ] API /reports: GET /plame?from=&to= → CSV real
[ ] Migrar cada página de mock.ts → useQuery al endpoint correspondiente
[ ] Upload de fotos de incidentes y documentos (PHP valida MIME)
[ ] .htaccess definitivo para React Router + paso de /api/ al PHP
```

**Criterio de salida de Fase 1:** un supervisor real puede registrarse, agregar workers, registrar check-ins e incidentes, y descargar el reporte de asistencia del mes. Sin datos hardcodeados.

---

### Fase 2 — Operaciones en tiempo real y app móvil
> Objetivo: polling automático en el panel + API lista para consumir desde Android.

```
[ ] Polling cada 30s en /live y /dashboard (o WebSocket si el hosting lo permite)
[ ] Push notifications de incidentes críticos (email vía PHP mail / SMTP)
[ ] Alertas automáticas de documentos por vencer (cron job o script manual)
[ ] API /auth/worker-login (DNI + PIN) para app Android
[ ] Endpoint POST /checkins acepta batch firmado offline
[ ] Export PLAME con formato validado contra planilla electrónica real
[ ] Multi-sede: filtros por obra en dashboard y live ops
[ ] Onboarding: wizard de setup para empresa nueva (crear sedes, invitar supervisores)
```

---

## Seguridad

**PHP (backend):**
- Passwords con `password_hash()` (bcrypt, cost 12)
- PDO prepared statements en todas las consultas — sin concatenación de SQL
- Uploads: validar MIME real con `finfo_file()`, no la extensión del cliente
- JWT validado en cada request protegido; verificar `company_id` para aislar datos entre empresas
- Headers CORS explícitos: solo el origen del frontend en producción
- `.htaccess` bloquea acceso directo a `/backend/src`, `/backend/config`, `/backend/storage`

**React (frontend):**
- JWT en `localStorage`; nunca en el código fuente ni en URLs
- Todas las variables de entorno sensibles en `.env` (Vite las prefija con `VITE_`)
- Sanitizar cualquier HTML renderizado desde la API con DOMPurify si aplica

---

## Variables de entorno

**`backend/config/database.php`** (en `.gitignore`):
```php
define('DB_HOST',     'localhost');
define('DB_NAME',     'trakia_mvp');
define('DB_USER',     'tu_usuario');
define('DB_PASS',     'tu_password');
define('APP_SECRET',  'clave_larga_aleatoria_min_32_chars');
define('APP_URL',     'https://tu-dominio.com');
define('UPLOAD_PATH', __DIR__ . '/../storage/uploads/');
```

**`frontend/.env`** (en `.gitignore`):
```
VITE_API_BASE=https://tu-dominio.com/api/v1
```

---

## Deploy en shared hosting

```
1. npm run build          # en /frontend → genera /dist
2. Subir contenido de /dist al root del hosting (FTP / cPanel)
3. Subir carpeta /backend al mismo root
4. Importar backend/database/schema.sql desde phpMyAdmin
5. Crear backend/config/database.php con credenciales reales
6. Dar permisos 755 a backend/storage/uploads/
7. El .htaccess ya está incluido en el build — no tocar
```

El servidor nunca ejecuta Node. Solo sirve archivos estáticos de React y procesa requests PHP en `/api/`.
