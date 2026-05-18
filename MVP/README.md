# TRAKIA MVP — Planificación técnica

Sistema de operaciones para trabajadores de campo. MVP hosteable en cualquier shared hosting con soporte PHP + MySQL.

---

## Stack tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Backend | PHP 8.1+ | Universal en shared hosting, sin dependencias especiales |
| Base de datos | MySQL 8.x | Disponible en casi todo hosting compartido |
| Estilos | Tailwind CSS (CDN) | Sin build step; mismo sistema visual que la landing |
| Frontend | Vanilla JS | Sin framework, sin bundler, carga rápida |
| Mapas | Leaflet.js | Open source, liviano, no requiere API key para MVP |
| Gráficos | Chart.js | Liviano, suficiente para dashboards del MVP |
| Auth | PHP Sessions + JWT simple | Sin dependencias externas |
| Upload | PHP nativo | SCTR, fotos de incidentes, documentos |

**No se usa:** Next.js, React, Vue, Node.js, Composer (opcional), SSR con hidratación, Docker.

**Requisitos mínimos de hosting:**
- PHP 8.0+ con extensiones: `pdo_mysql`, `gd`, `fileinfo`, `mbstring`
- MySQL 5.7+ / MariaDB 10.4+
- `.htaccess` con `mod_rewrite`
- 512 MB RAM mínimo

---

## Arquitectura

```
MVP/
├── public/                  ← Web root (apunta aquí el dominio)
│   ├── index.php            ← Entry point único, router frontal
│   ├── .htaccess            ← Redirige todo a index.php
│   └── assets/
│       ├── css/custom.css   ← Estilos sobre Tailwind
│       ├── js/app.js        ← Lógica compartida (fetch, helpers)
│       └── img/
├── src/
│   ├── Core/
│   │   ├── Router.php       ← Router simple basado en $_SERVER['REQUEST_URI']
│   │   ├── DB.php           ← PDO singleton
│   │   ├── Auth.php         ← Sesión + helpers de permisos
│   │   └── Response.php     ← Helpers JSON / redirect
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── WorkerController.php
│   │   ├── CheckinController.php
│   │   ├── TaskController.php
│   │   ├── IncidentController.php
│   │   ├── DocumentController.php
│   │   └── ReportController.php
│   ├── Models/
│   │   ├── Company.php
│   │   ├── User.php
│   │   ├── Worker.php
│   │   ├── Checkin.php
│   │   ├── Task.php
│   │   ├── Incident.php
│   │   └── Document.php
│   └── Views/
│       ├── layout/
│       │   ├── base.php     ← HTML base, nav, sidebar
│       │   └── auth.php     ← Layout para login/register
│       ├── dashboard/
│       ├── workers/
│       ├── checkins/
│       ├── tasks/
│       ├── incidents/
│       ├── documents/
│       └── reports/
├── api/
│   └── v1/
│       ├── index.php        ← Router de la API REST (para app móvil futura)
│       ├── auth.php
│       ├── checkin.php
│       ├── tasks.php
│       └── incidents.php
├── config/
│   ├── database.php         ← Credenciales DB (no subir a git)
│   └── app.php              ← Constantes globales
├── database/
│   ├── schema.sql           ← Estructura completa
│   └── seed.sql             ← Datos de prueba
├── storage/
│   └── uploads/             ← Fotos, documentos (777, fuera del web root si es posible)
└── .htaccess                ← Redirige a public/
```

### Flujo de una petición

```
Navegador → public/index.php → Router → Controller → Model → DB
                                                    ↓
                                              View (PHP puro)
                                                    ↓
                                              HTML al navegador
```

La API (`/api/v1/`) responde JSON puro para la app Android futura. El panel web usa el mismo backend pero devuelve HTML renderizado en servidor.

---

## Roles y permisos

| Rol | Acceso |
|---|---|
| `admin` | Todo. Gestiona empresa, usuarios, workers, reportes, facturación |
| `supervisor` | Asigna tareas, ve dashboard, registra incidentes, valida check-ins |
| `worker` | Solo API móvil: check-in/out, tareas propias, reportar incidentes |

---

## Base de datos

### Diagrama de tablas

```
companies ──< users
companies ──< workers ──< worker_documents
companies ──< sites
companies ──< tasks ──< task_assignments >── workers
workers ──< checkins >── sites
workers ──< incidents >── sites
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
  password     VARCHAR(255) NOT NULL,       -- bcrypt
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
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_id   INT UNSIGNED NOT NULL,
  site_id      INT UNSIGNED,
  supervisor_id INT UNSIGNED NOT NULL,
  titulo       VARCHAR(200) NOT NULL,
  descripcion  TEXT,
  fecha        DATE NOT NULL,
  prioridad    ENUM('baja','normal','alta') DEFAULT 'normal',
  estado       ENUM('pendiente','en_progreso','completada','problema') DEFAULT 'pendiente',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (supervisor_id) REFERENCES users(id)
);

-- Asignación de tareas a trabajadores
CREATE TABLE task_assignments (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id      INT UNSIGNED NOT NULL,
  worker_id    INT UNSIGNED NOT NULL,
  estado       ENUM('pendiente','completada','problema') DEFAULT 'pendiente',
  nota_worker  TEXT,
  foto         VARCHAR(255),
  completada_at DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
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
| Login | `/login` | Email + password, JWT en cookie |
| Dashboard | `/` | KPIs del día: presentes, ausentes, incidentes, tareas completadas |
| Trabajadores | `/workers` | Listado con búsqueda, estado de documentos, badge activo/inactivo |
| Nuevo trabajador | `/workers/create` | Formulario alta |
| Perfil trabajador | `/workers/{id}` | Historial de check-ins, tareas, incidentes, documentos |
| Check-ins hoy | `/checkins` | Tabla tiempo real con mapa Leaflet de ubicaciones |
| Tareas | `/tasks` | Kanban simple: pendiente / en progreso / completada |
| Nueva tarea | `/tasks/create` | Formulario con asignación múltiple de workers |
| Incidentes | `/incidents` | Listado con filtro por severidad, foto, ubicación en mapa |
| Documentos | `/documents` | Vista de documentos próximos a vencer (30, 15, 7 días) |
| Reportes | `/reports` | Exportar asistencia a CSV/Excel formato PLAME |
| Config empresa | `/settings` | Datos empresa, sedes, usuarios |

### Componentes de UI reutilizables

- `stat-card` — KPI con número, etiqueta y delta
- `badge` — estado coloreado (verde/ámbar/rojo/azul)
- `data-table` — tabla con búsqueda, paginación
- `modal` — confirmación, formulario rápido
- `alert-banner` — avisos de documentos por vencer

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

---

## API REST (para app móvil Android — fase 2)

Base: `https://dominio.com/api/v1/`

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/login` | Login worker por DNI + PIN |
| POST | `/checkins` | Registrar entrada/salida (acepta batch offline) |
| GET | `/tasks` | Tareas del día del worker autenticado |
| PATCH | `/tasks/{id}` | Actualizar estado de tarea |
| POST | `/incidents` | Reportar incidente con foto (multipart) |
| GET | `/workers/me` | Perfil y documentos del worker |

Todos los endpoints de la API devuelven JSON con estructura:
```json
{ "ok": true, "data": {}, "error": null }
```

La app Android enviará `Authorization: Bearer {jwt}` en cada request. Para MVP, JWT firmado con `HS256` usando `APP_SECRET` en config.

---

## Módulos por prioridad (orden de construcción)

```
Semana 1 — Base
  [x] Setup hosting, DB, config
  [x] Auth (login, sesión, logout)
  [x] CRUD empresas + trabajadores

Semana 2 — Operaciones core
  [ ] Check-ins: registro manual desde panel, vista con mapa
  [ ] Dashboard: KPIs del día
  [ ] API /checkins para app móvil

Semana 3 — Incidentes y tareas
  [ ] Módulo incidentes con foto upload
  [ ] Módulo tareas + asignación + kanban
  [ ] API /tasks e /incidents

Semana 4 — Documentos y reportes
  [ ] Upload documentos + alertas de vencimiento
  [ ] Export CSV asistencia (PLAME)
  [ ] Ajustes de UI, mobile responsive
```

---

## Seguridad mínima en PHP

- Passwords con `password_hash()` (bcrypt, cost 12)
- Toda entrada de usuario pasa por `htmlspecialchars()` en las vistas
- Consultas con PDO prepared statements (sin concatenación de SQL)
- Uploads: validar MIME con `finfo`, no confiar en extensión del cliente
- CSRF token en todos los formularios POST
- Sesión con `session_regenerate_id(true)` tras login
- `.htaccess` bloquea acceso directo a `/src`, `/config`, `/storage`

---

## Variables de entorno (config/database.php)

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'trakia_mvp');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
define('APP_SECRET', 'clave_larga_aleatoria');
define('APP_URL', 'https://tu-dominio.com');
define('UPLOAD_PATH', __DIR__ . '/../storage/uploads/');
```

Este archivo va en `.gitignore`.

---

## Deploy en shared hosting

1. Subir carpeta `MVP/` por FTP/cPanel
2. Apuntar el dominio a `MVP/public/`
3. Importar `database/schema.sql` desde phpMyAdmin
4. Copiar `config/database.php.example` → `config/database.php` con credenciales reales
5. Dar permisos `755` a `storage/uploads/`
6. Listo — no requiere Composer, npm, ni ningún build step
