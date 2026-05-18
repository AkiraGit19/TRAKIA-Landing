# TRAKIA MVP — Planificación técnica

Sistema de operaciones para trabajadores de campo. Frontend React (build estático), backend PHP + MySQL. Hosteable en cualquier shared hosting con soporte PHP.

---

## Stack tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | React 18 + Vite | Build estático deployable en cualquier host; componentes reutilizables |
| Routing | React Router v6 | Client-side routing; funciona con `.htaccess` en Apache |
| Estilos | Tailwind CSS v3 | Mismo sistema visual que la landing; JIT integrado en Vite |
| Mapas | Leaflet + react-leaflet | Open source, sin API key |
| Gráficos | Recharts | Liviano, nativo React, suficiente para dashboards |
| Backend | PHP 8.1+ | Universal en shared hosting |
| Base de datos | MySQL 8.x | Disponible en casi todo hosting compartido |
| Auth | JWT (HS256) | PHP genera el token; React lo guarda en `localStorage` |
| Upload | PHP nativo | SCTR, fotos de incidentes, documentos |

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
├── frontend/                    ← Proyecto React + Vite
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx              ← Router raíz
│   │   ├── api/
│   │   │   └── client.js        ← fetch wrapper con JWT
│   │   ├── components/
│   │   │   ├── ui/              ← StatCard, Badge, DataTable, Modal, etc.
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.jsx ← Sidebar + topbar
│   │   │   │   └── AuthLayout.jsx
│   │   │   └── maps/
│   │   │       └── CheckinMap.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
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
│   ├── vite.config.js
│   ├── tailwind.config.js
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

## Módulos por prioridad (orden de construcción)

```
Semana 1 — Base
  [ ] Setup Vite + React + Tailwind + React Router
  [ ] AppShell con sidebar y navegación
  [ ] Backend: DB, Auth JWT, estructura de carpetas PHP
  [ ] Auth completo: login, ProtectedRoute, logout

Semana 2 — Workers y check-ins
  [ ] CRUD workers (lista, alta, perfil)
  [ ] Registro de check-ins desde panel + mapa Leaflet
  [ ] Dashboard con KPIs del día
  [ ] API /checkins para futura app móvil

Semana 3 — Incidentes y tareas
  [ ] Módulo incidentes: lista, nuevo, detalle con foto y mapa
  [ ] Módulo tareas: kanban + formulario de asignación
  [ ] API /tasks e /incidents

Semana 4 — Documentos, reportes y pulido
  [ ] Upload documentos + vista de próximos a vencer
  [ ] Export CSV PLAME
  [ ] Responsive móvil, estados vacíos, loading skeletons
  [ ] Settings: sedes, usuarios supervisores
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
