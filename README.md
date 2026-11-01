# RaidPlanner – Frontend

Aplicación web (React + Vite) para planificar raids de un videojuego cooperativo: clanes, asignación automática de roles tácticos, check-in de asistencia y "Fallómetro" con rankings. Consume la API REST del repositorio [raid-planner-backend](https://github.com/earciniegas07/raid-planner-backend).

## URLs públicas
| Recurso | URL |
|---|---|
| Frontend (Vercel) | `https://REEMPLAZAR-FRONT.vercel.app` |
| API (Render) | `https://REEMPLAZAR-API.onrender.com` |
| Swagger | `https://REEMPLAZAR-API.onrender.com/api-docs` |
| Repositorio backend | `https://github.com/earciniegas07/raid-planner-backend` |

> El backend está en el plan gratuito de Render: la primera carga puede tardar ~30 s mientras el servicio despierta.

## Credenciales de prueba
| Rol | Email | Contraseña |
|---|---|---|
| Administrador (Raid Leader) | admin@raidplanner.com | Test1234 |
| Administrador (Officer) | ironshield@raidplanner.com | Test1234 |
| Usuario estándar (Raider) | jugador@raidplanner.com | Test1234 |

## Stack
React 19 · Vite · React Router 7 · Axios · Context API (estado) · CSS propio (responsivo)

## Instalación local
Requisitos: Node.js 20+ y el backend corriendo (ver su README).

```bash
cd raid-planner          # carpeta de la app (donde está package.json)
npm install
cp .env.example .env     # y ajustar VITE_API_URL
npm run dev              # http://localhost:5173
```

Otros comandos: `npm run build` (producción), `npm run preview`, `npm run lint`.

## Variables de entorno
| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API, incluyendo `/api` | `http://localhost:5000/api` |

Vite incrusta la variable en el build: si cambia en Vercel hay que **redesplegar**. El archivo `.env` no se versiona.

## Despliegue (Vercel)
- *Root Directory*: `raid-planner` (la subcarpeta con el `package.json` de la app).
- Framework: Vite · Build: `npm run build` · Output: `dist`.
- Variable `VITE_API_URL` apuntando a `https://<api>.onrender.com/api`.
- `vercel.json` redirige todas las rutas a `index.html` (SPA).
- En el backend, `FRONTEND_URL` debe contener la URL de Vercel (CORS).

## Rutas y roles
| Ruta | Acceso | Contenido |
|---|---|---|
| `/login`, `/register` | Público | Autenticación |
| `/raids` | Autenticado | Listado y filtro de raids; check-in/out; acciones según rol |
| `/clans` | Autenticado | Clanes, unirse, roster; editar (admin) y eliminar (Raid Leader) |
| `/hall` | Autenticado | Ranking de fiabilidad, audit log, Hard Carry / Bench Warmer / Mechanics Pro |
| `/admin` | Raid Leader u Officer | Crear raids y clanes, registrar fallos |

| Acción | Usuario estándar | Officer | Raid Leader |
|---|---|---|---|
| Ver raids, clanes y rankings | ✔ | ✔ | ✔ |
| Unirse a un clan, check-in / checkout | ✔ | ✔ | ✔ |
| Crear/editar/eliminar raids, bloquear e iniciar, reasignar roles, registrar fallos | – | ✔ | ✔ |
| Editar clanes | – | ✔ | ✔ |
| Eliminar clanes, completar/fallar raid | – | – | ✔ |

La UI oculta lo que el rol no puede hacer y el backend lo vuelve a validar.

## Arquitectura
```
src/
├── services/api.js        # Axios + interceptores (JWT en cabecera, 401 → logout)
├── context/
│   ├── AuthContext.jsx    # sesión, login/registro/logout, isAdmin
│   ├── RaidContext.jsx    # datos del servidor (raids, clanes, usuarios, rankings) y mutaciones
│   └── ToastContext.jsx   # notificaciones de éxito/error
├── components/            # RaidCard, RaidForm, ClanForm, FailureTracker, RoleAssignments, ...
├── pages/                 # Login, Register, Raids, Clans, HallOfShame, Admin
└── utils/format.js
```
- **Sin datos mock:** todo viene de la API. El token JWT se guarda en `localStorage` y se adjunta con un interceptor de Axios; un 401 cierra la sesión.
- **Estados de UI:** indicador de carga, mensaje de error con "Reintentar", estados vacíos, botones deshabilitados durante peticiones y validación de formularios.

## Endpoints consumidos
| Funcionalidad | Método y ruta |
|---|---|
| Registro / login / sesión | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Jugadores | `GET /users` |
| Clanes (CRUD) | `GET/POST /clans`, `PUT/DELETE /clans/:id` |
| Unirse a clan | `POST /clans/:id/join` |
| Rankings de clan | `GET /clans/:id/rankings` |
| Raids (CRUD) | `GET/POST /raids`, `PUT/DELETE /raids/:id` |
| Cambio de estado | `PATCH /raids/:id/state` |
| Reasignar rol | `PATCH /raids/:id/assignments/:userId` |
| Fallos | `POST /raids/:id/failures` |
| Asistencia | `PATCH /raids/:id/checkin`, `PATCH /raids/:id/checkout` |
| Ranking global | `GET /raids/rankings/all` |

La documentación completa de la API está en el README del backend y en `/api-docs`.
