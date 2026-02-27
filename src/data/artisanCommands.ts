export interface CommandOption {
  name: string;
  desc: string;
}

export interface Command {
  name: string;
  description: string;
  examples: string[];
  options?: CommandOption[];
  tags: string[];
}

export interface CommandCategory {
  [category: string]: Command[];
}

export const commands: CommandCategory = {
  "Generales": [
    {
      name: "about",
      description: "Muestra información general sobre la aplicación Laravel, incluyendo versión del framework, PHP, drivers configurados, caché y estado de mantenimiento.",
      examples: ["php artisan about", "php artisan about --only=environment", "php artisan about --json"],
      tags: ["info", "debug"]
    },
    {
      name: "help",
      description: "Muestra la ayuda para un comando específico, detallando sus argumentos y opciones.",
      examples: ["php artisan help make:model", "php artisan help migrate"],
      tags: ["ayuda"]
    },
    {
      name: "clear-compiled",
      description: "Elimina el archivo de clases compiladas (bootstrap/cache/compiled.php). Crítico cuando hay errores de 'class not found' tras updates.",
      examples: ["php artisan clear-compiled"],
      tags: ["cache", "optimización"]
    },
    {
      name: "completion",
      description: "Genera script de auto-completado para tu shell (Bash/Zsh/Fish).",
      examples: ["php artisan completion bash", "php artisan completion zsh"],
      tags: ["utilidad"]
    },
    {
      name: "db",
      description: "Inicia una sesión interactiva CLI con la base de datos configurada (MySQL, PgSQL, SQLite).",
      examples: ["php artisan db", "php artisan db mysql"],
      tags: ["database", "debug"]
    },
    {
      name: "docs",
      description: "Abre la documentación oficial de Laravel en el navegador.",
      examples: ["php artisan docs", "php artisan docs validation"],
      tags: ["ayuda"]
    },
    {
      name: "down",
      description: "Pone la aplicación en modo mantenimiento (503).",
      examples: [
        "php artisan down",
        "php artisan down --secret=\"1630542a-246b-4b66-afa1-dd72a4c43515\"",
        "php artisan down --refresh=15",
        "php artisan down --retry=60"
      ],
      options: [
        { name: "--secret", desc: "Token para acceder al sitio estando en mantenimiento" },
        { name: "--render", desc: "Vista personalizada a renderizar" },
        { name: "--refresh", desc: "Tiempo en segundos para refrescar el navegador" }
      ],
      tags: ["mantenimiento", "producción"]
    },
    {
      name: "up",
      description: "Saca la aplicación del modo mantenimiento.",
      examples: ["php artisan up"],
      tags: ["mantenimiento", "producción"]
    },
    {
      name: "env",
      description: "Muestra el entorno actual.",
      examples: ["php artisan env"],
      tags: ["configuración"]
    },
    {
      name: "inspire",
      description: "Muestra una cita inspiradora (Easter egg).",
      examples: ["php artisan inspire"],
      tags: ["diversión"]
    },
    {
      name: "list",
      description: "Lista todos los comandos disponibles.",
      examples: ["php artisan list", "php artisan list make --format=json"],
      tags: ["ayuda"]
    },
    {
      name: "optimize",
      description: "Cachea framework, rutas, config y eventos. OBLIGATORIO en deploy a producción.",
      examples: ["php artisan optimize"],
      tags: ["optimización", "producción"]
    },
    {
      name: "optimize:clear",
      description: "Elimina TODOS los archivos de caché generados por optimize, views, events, config y routes.",
      examples: ["php artisan optimize:clear"],
      tags: ["limpieza", "debug"]
    },
    {
      name: "serve",
      description: "Servidor de desarrollo local.",
      examples: ["php artisan serve", "php artisan serve --port=8080"],
      tags: ["desarrollo"]
    },
    {
      name: "tinker",
      description: "REPL interactivo (PsySH) para ejecutar código PHP dentro de la app.",
      examples: ["php artisan tinker", "php artisan tinker --execute=\"User::first()\""],
      tags: ["debug", "desarrollo"]
    },
    {
      name: "model:show",
      description: "Muestra una visión detallada de un modelo Eloquent (atributos, relaciones, observers).",
      examples: ["php artisan model:show User"],
      tags: ["info", "model"]
    },
    {
      name: "model:prune",
      description: "Elimina modelos que ya no son necesarios (basado en el trait Prunable).",
      examples: ["php artisan model:prune", "php artisan model:prune --pretend"],
      tags: ["limpieza", "model"]
    }
  ],
  "Make (Generadores)": [
    {
      name: "make:model",
      description: "Crea un modelo Eloquent. Es el comando más potente por sus flags combinables.",
      examples: [
        "php artisan make:model Product",
        "php artisan make:model Product -m (con migración)",
        "php artisan make:model Product -mc (con migración y controlador)",
        "php artisan make:model Product -mcr (migración, controlador resource)",
        "php artisan make:model Product -mfsc (migración, factory, seeder, controller)",
        "php artisan make:model Product --all (Todo: migracion, factory, seeder, policy, controller, requests)",
        "php artisan make:model Category --pivot (Modelo para tabla pivote)"
      ],
      options: [
        { name: "-m, --migration", desc: "Crear archivo de migración" },
        { name: "-c, --controller", desc: "Crear controlador" },
        { name: "-r, --resource", desc: "Controlador tipo Resource (CRUD)" },
        { name: "--api", desc: "Controlador tipo API (sin create/edit)" },
        { name: "-f, --factory", desc: "Crear Factory" },
        { name: "-s, --seed", desc: "Crear Seeder" },
        { name: "--policy", desc: "Crear Policy" },
        { name: "-a, --all", desc: "Generar TODO lo anterior" },
        { name: "--pivot", desc: "Indica que es un modelo de tabla intermedia (extiende de Pivot)" }
      ],
      tags: ["generador", "esencial"]
    },
    {
      name: "make:controller",
      description: "Crea un nuevo controlador.",
      examples: [
        "php artisan make:controller UserController",
        "php artisan make:controller UserController --resource --model=User",
        "php artisan make:controller API/UserController --api",
        "php artisan make:controller ProfileController --invokable"
      ],
      options: [
        { name: "--resource", desc: "Generar métodos CRUD" },
        { name: "--api", desc: "Generar métodos CRUD para API (excluye vistas)" },
        { name: "--invokable", desc: "Controlador de acción única (__invoke)" },
        { name: "--model", desc: "Vincular modelo automáticamente (Route Model Binding)" },
        { name: "--parent", desc: "Generar controlador para recurso anidado" }
      ],
      tags: ["generador", "controlador"]
    },
    {
      name: "make:migration",
      description: "Crea un archivo de migración de base de datos.",
      examples: [
        "php artisan make:migration create_orders_table",
        "php artisan make:migration add_status_to_orders_table --table=orders"
      ],
      options: [
        { name: "--create", desc: "Especifica tabla a crear (se infiere del nombre usualmente)" },
        { name: "--table", desc: "Especifica tabla a modificar" }
      ],
      tags: ["generador", "database"]
    },
    {
      name: "make:component",
      description: "Crea un componente de Blade.",
      examples: [
        "php artisan make:component Alert",
        "php artisan make:component Forms/Input --view (solo vista)",
        "php artisan make:component Alert --inline (solo clase con template inline)"
      ],
      tags: ["generador", "frontend"]
    },
    {
      name: "make:seeder",
      description: "Crea un Database Seeder.",
      examples: ["php artisan make:seeder UsersTableSeeder"],
      tags: ["generador", "database"]
    },
    {
      name: "make:factory",
      description: "Crea un Model Factory.",
      examples: ["php artisan make:factory PostFactory --model=Post"],
      tags: ["generador", "testing"]
    },
    {
      name: "make:middleware",
      description: "Crea un middleware HTTP.",
      examples: ["php artisan make:middleware EnsureIsAdmin"],
      tags: ["generador", "http"]
    },
    {
      name: "make:request",
      description: "Crea un FormRequest para validación.",
      examples: ["php artisan make:request StoreProductRequest"],
      tags: ["generador", "validación"]
    },
    {
      name: "make:resource",
      description: "Crea un API Resource (Transformador JSON).",
      examples: ["php artisan make:resource UserResource", "php artisan make:resource UserCollection --collection"],
      tags: ["generador", "api"]
    },
    {
      name: "make:command",
      description: "Crea un comando personalizado de Artisan.",
      examples: ["php artisan make:command ImportCsv"],
      tags: ["generador", "console"]
    },
    {
      name: "make:job",
      description: "Crea un Job para colas.",
      examples: ["php artisan make:job ProcessPodcast", "php artisan make:job SendEmail --sync"],
      tags: ["generador", "queue"]
    },
    {
      name: "make:event",
      description: "Crea una clase de Evento.",
      examples: ["php artisan make:event OrderShipped"],
      tags: ["generador", "event"]
    },
    {
      name: "make:listener",
      description: "Crea un Listener para un evento.",
      examples: [
        "php artisan make:listener SendShipmentNotification --event=OrderShipped",
        "php artisan make:listener SendShipmentNotification --queued"
      ],
      tags: ["generador", "event"]
    },
    {
      name: "make:mail",
      description: "Crea una clase Mailable para correos.",
      examples: ["php artisan make:mail WelcomeEmail", "php artisan make:mail OrderShipped --markdown=emails.orders.shipped"],
      tags: ["generador", "mail"]
    },
    {
      name: "make:notification",
      description: "Crea una notificación (Email, Slack, DB, SMS).",
      examples: ["php artisan make:notification InvoicePaid", "php artisan make:notification ServerDown --markdown=notifications.server.down"],
      tags: ["generador", "notification"]
    },
    {
      name: "make:observer",
      description: "Crea un Observer para escuchar ciclo de vida de modelos.",
      examples: ["php artisan make:observer UserObserver --model=User"],
      tags: ["generador", "model"]
    },
    {
      name: "make:policy",
      description: "Crea una Policy de autorización.",
      examples: ["php artisan make:policy PostPolicy", "php artisan make:policy PostPolicy --model=Post"],
      tags: ["generador", "auth"]
    },
    {
      name: "make:provider",
      description: "Crea un Service Provider.",
      examples: ["php artisan make:provider RepositoryServiceProvider"],
      tags: ["generador", "setup"]
    },
    {
      name: "make:rule",
      description: "Crea una regla de validación personalizada.",
      examples: ["php artisan make:rule Uppercase", "php artisan make:rule ValidCoupon --implicit"],
      tags: ["generador", "validación"]
    },
    {
      name: "make:test",
      description: "Crea un test (PHPUnit o Pest).",
      examples: ["php artisan make:test UserTest", "php artisan make:test UserTest --unit", "php artisan make:test UserTest --pest"],
      tags: ["generador", "testing"]
    },
    {
      name: "make:channel",
      description: "Crea un canal de broadcasting para websockets.",
      examples: ["php artisan make:channel OrderChannel"],
      tags: ["generador", "broadcasting"]
    },
    {
      name: "make:exception",
      description: "Crea una excepción personalizada.",
      examples: ["php artisan make:exception InvalidOrderException", "php artisan make:exception PaymentFailedException --render"],
      tags: ["generador", "debug"]
    },
    {
      name: "make:cast",
      description: "Crea un Custom Cast para atributos de Eloquent.",
      examples: ["php artisan make:cast JsonSettings"],
      tags: ["generador", "model"]
    },
    {
      name: "make:enum",
      description: "Crea un Enum de PHP (Laravel 9+).",
      examples: ["php artisan make:enum UserRole --string", "php artisan make:enum Status --int"],
      tags: ["generador", "php"]
    },
    {
      name: "make:scope",
      description: "Crea un Scope para modelos.",
      examples: ["php artisan make:scope ActiveUserScope"],
      tags: ["generador", "model"]
    },
    {
      name: "make:view",
      description: "Crea un archivo de vista Blade.",
      examples: ["php artisan make:view index", "php artisan make:view pages.contact --extension=blade.php"],
      tags: ["generador", "view"]
    }
  ],
  "Filament (Admin Panel)": [
    {
      name: "make:filament-resource",
      description: "Crea un recurso de Filament (Listado, Creación, Edición) para un modelo.",
      examples: [
        "php artisan make:filament-resource Customer",
        "php artisan make:filament-resource Customer --generate (genera columnas y campos auto)",
        "php artisan make:filament-resource Customer --simple (modal simple)",
        "php artisan make:filament-resource Customer --soft-deletes",
        "php artisan make:filament-resource Customer --view"
      ],
      options: [
        { name: "--generate", desc: "Intenta adivinar columnas y campos basado en la DB" },
        { name: "--simple", desc: "Genera un recurso modal simple (sin páginas separadas)" },
        { name: "--soft-deletes", desc: "Añade funcionalidad para recuperar/borrar forzoso" }
      ],
      tags: ["filament", "admin"]
    },
    {
      name: "make:filament-user",
      description: "Crea un usuario administrador para acceder al panel.",
      examples: ["php artisan make:filament-user"],
      tags: ["filament", "auth"]
    },
    {
      name: "make:filament-page",
      description: "Crea una página personalizada en el panel.",
      examples: ["php artisan make:filament-page Settings", "php artisan make:filament-page Dashboard --resource=UserResource"],
      tags: ["filament", "admin"]
    },
    {
      name: "make:filament-widget",
      description: "Crea un widget para dashboards (gráficos, estadísticas).",
      examples: ["php artisan make:filament-widget StatsOverview --stats-overview", "php artisan make:filament-widget UserChart --chart"],
      tags: ["filament", "dashboard"]
    },
    {
      name: "make:filament-relation-manager",
      description: "Crea un gestor de relaciones para ver datos vinculados dentro de un recurso.",
      examples: ["php artisan make:filament-relation-manager CategoryResource posts title"],
      tags: ["filament", "admin"]
    },
    {
      name: "filament:install",
      description: "Instala y configura Filament en el proyecto.",
      examples: ["php artisan filament:install --panels"],
      tags: ["filament", "setup"]
    },
    {
      name: "filament:assets",
      description: "Publica los assets (CSS/JS) de Filament. Necesario tras updates.",
      examples: ["php artisan filament:assets"],
      tags: ["filament", "mantenimiento"]
    },
    {
      name: "filament:optimize",
      description: "Optimiza los iconos y componentes de Filament para producción.",
      examples: ["php artisan filament:optimize"],
      tags: ["filament", "performance"]
    }
  ],
  "Livewire": [
    {
      name: "make:livewire",
      description: "Crea un componente de Livewire (Clase + Vista). Alias: livewire:make.",
      examples: [
        "php artisan make:livewire Counter",
        "php artisan make:livewire ShowPosts --inline (sin archivo de vista)",
        "php artisan make:livewire Admin/Users/ListUsers"
      ],
      tags: ["livewire", "generador"]
    },
    {
      name: "livewire:layout",
      description: "Crea un archivo de layout base para Livewire.",
      examples: ["php artisan livewire:layout"],
      tags: ["livewire", "setup"]
    },
    {
      name: "livewire:publish",
      description: "Publica la configuración y assets de Livewire.",
      examples: ["php artisan livewire:publish --config", "php artisan livewire:publish --assets"],
      tags: ["livewire", "config"]
    },
    {
      name: "livewire:delete",
      description: "Elimina un componente Livewire y su vista.",
      examples: ["php artisan livewire:delete Counter"],
      tags: ["livewire", "limpieza"]
    },
    {
      name: "livewire:copy",
      description: "Copia un componente Livewire a otro nombre.",
      examples: ["php artisan livewire:copy OldComponent NewComponent"],
      tags: ["livewire", "utilidad"]
    },
    {
      name: "livewire:move",
      description: "Mueve/Renombra un componente Livewire.",
      examples: ["php artisan livewire:move OldComponent NewFolder/NewComponent"],
      tags: ["livewire", "utilidad"]
    },
    {
      name: "livewire:stubs",
      description: "Publica los stubs para personalizar la generación de componentes.",
      examples: ["php artisan livewire:stubs"],
      tags: ["livewire", "config"]
    }
  ],
  "Database & Migrate": [
    {
      name: "migrate",
      description: "Ejecuta migraciones pendientes.",
      examples: ["php artisan migrate", "php artisan migrate --force (producción)", "php artisan migrate --seed"],
      tags: ["database", "esencial"]
    },
    {
      name: "migrate:fresh",
      description: "BORRA todas las tablas y ejecuta migraciones desde cero.",
      examples: ["php artisan migrate:fresh", "php artisan migrate:fresh --seed"],
      tags: ["database", "peligroso"]
    },
    {
      name: "migrate:refresh",
      description: "Revierte todas las migraciones y las vuelve a ejecutar.",
      examples: ["php artisan migrate:refresh", "php artisan migrate:refresh --step=5"],
      tags: ["database", "dev"]
    },
    {
      name: "migrate:rollback",
      description: "Revierte el último lote de migraciones.",
      examples: ["php artisan migrate:rollback", "php artisan migrate:rollback --step=1 (solo la última)"],
      tags: ["database", "undo"]
    },
    {
      name: "migrate:status",
      description: "Muestra qué migraciones han corrido y cuáles faltan.",
      examples: ["php artisan migrate:status"],
      tags: ["database", "info"]
    },
    {
      name: "db:seed",
      description: "Ejecuta los seeders.",
      examples: ["php artisan db:seed", "php artisan db:seed --class=UserSeeder"],
      tags: ["database", "data"]
    },
    {
      name: "db:wipe",
      description: "Elimina todas las tablas de la base de datos.",
      examples: ["php artisan db:wipe"],
      tags: ["database", "peligroso"]
    },
    {
      name: "schema:dump",
      description: "Vuelca el esquema de la base de datos actual a un archivo SQL (útil para proyectos grandes).",
      examples: ["php artisan schema:dump", "php artisan schema:dump --prune (borra migraciones viejas)"],
      tags: ["database", "avanzado"]
    },
    {
      name: "db:monitor",
      description: "Verifica el número de conexiones a la base de datos.",
      examples: ["php artisan db:monitor --max=100"],
      tags: ["database", "monitor"]
    }
  ],
  "Cache": [
    {
      name: "cache:clear",
      description: "Limpia la caché de la aplicación.",
      examples: ["php artisan cache:clear", "php artisan cache:clear --store=redis"],
      tags: ["cache"]
    },
    {
      name: "cache:forget",
      description: "Borra una key específica de la caché.",
      examples: ["php artisan cache:forget key_name"],
      tags: ["cache"]
    },
    {
      name: "cache:table",
      description: "Crea una migración para la tabla de caché (si usas driver 'database').",
      examples: ["php artisan cache:table"],
      tags: ["cache", "setup"]
    }
  ],
  "Config & Env": [
    {
      name: "config:cache",
      description: "Combina configs en un archivo. Esencial en Producción.",
      examples: ["php artisan config:cache"],
      tags: ["config", "performance"]
    },
    {
      name: "config:clear",
      description: "Elimina la caché de configuración. Usar tras editar .env.",
      examples: ["php artisan config:clear"],
      tags: ["config", "dev"]
    },
    {
      name: "config:publish",
      description: "Publica archivos de configuración de paquetes.",
      examples: ["php artisan config:publish --all"],
      tags: ["config"]
    },
    {
      name: "env:encrypt",
      description: "Encripta el archivo .env.",
      examples: ["php artisan env:encrypt"],
      tags: ["seguridad"]
    },
    {
      name: "env:decrypt",
      description: "Desencripta el archivo .env.",
      examples: ["php artisan env:decrypt --key=xxxxx"],
      tags: ["seguridad"]
    }
  ],
  "Queue & Jobs": [
    {
      name: "queue:work",
      description: "Inicia el worker para procesar colas.",
      examples: ["php artisan queue:work", "php artisan queue:work --stop-when-empty", "php artisan queue:work --queue=high,default"],
      tags: ["queue", "run"]
    },
    {
      name: "queue:listen",
      description: "Escucha colas (reinicia app en cada job, lento pero útil en dev).",
      examples: ["php artisan queue:listen"],
      tags: ["queue", "dev"]
    },
    {
      name: "queue:retry",
      description: "Reintenta un job fallido.",
      examples: ["php artisan queue:retry all", "php artisan queue:retry 5 (id)"],
      tags: ["queue", "fix"]
    },
    {
      name: "queue:failed",
      description: "Lista jobs fallidos.",
      examples: ["php artisan queue:failed"],
      tags: ["queue", "info"]
    },
    {
      name: "queue:flush",
      description: "Borra todos los jobs fallidos.",
      examples: ["php artisan queue:flush"],
      tags: ["queue", "limpieza"]
    },
    {
      name: "queue:table",
      description: "Crea migración para tabla de jobs (si usas driver 'database').",
      examples: ["php artisan queue:table"],
      tags: ["queue", "setup"]
    },
    {
      name: "queue:batches-table",
      description: "Crea migración para la tabla de lotes de jobs.",
      examples: ["php artisan queue:batches-table"],
      tags: ["queue", "setup"]
    },
    {
      name: "queue:failed-table",
      description: "Crea migración para la tabla de failed_jobs.",
      examples: ["php artisan queue:failed-table"],
      tags: ["queue", "setup"]
    }
  ],
  "Route": [
    {
      name: "route:list",
      description: "Lista todas las rutas.",
      examples: ["php artisan route:list", "php artisan route:list --path=api", "php artisan route:list --except-vendor"],
      tags: ["route", "info"]
    },
    {
      name: "route:cache",
      description: "Cachea rutas para producción.",
      examples: ["php artisan route:cache"],
      tags: ["route", "performance"]
    },
    {
      name: "route:clear",
      description: "Limpia caché de rutas.",
      examples: ["php artisan route:clear"],
      tags: ["route", "dev"]
    }
  ],
  "Storage & View": [
    {
      name: "storage:link",
      description: "Enlaza public/storage -> storage/app/public.",
      examples: ["php artisan storage:link"],
      tags: ["storage", "setup"]
    },
    {
      name: "view:cache",
      description: "Compila todas las vistas Blade.",
      examples: ["php artisan view:cache"],
      tags: ["view", "performance"]
    },
    {
      name: "view:clear",
      description: "Limpia vistas compiladas.",
      examples: ["php artisan view:clear"],
      tags: ["view", "limpieza"]
    }
  ],
  "Events": [
    {
      name: "event:generate",
      description: "Genera eventos y listeners faltantes basados en EventServiceProvider (Legacy) o atributos.",
      examples: ["php artisan event:generate"],
      tags: ["event", "generador"]
    },
    {
      name: "event:list",
      description: "Lista todos los eventos y sus listeners registrados.",
      examples: ["php artisan event:list"],
      tags: ["event", "info"]
    },
    {
      name: "event:cache",
      description: "Cachea la lista de eventos para mejorar rendimiento.",
      examples: ["php artisan event:cache"],
      tags: ["event", "performance"]
    },
    {
      name: "event:clear",
      description: "Elimina la caché de eventos.",
      examples: ["php artisan event:clear"],
      tags: ["event", "limpieza"]
    }
  ],
  "Schedule": [
    {
      name: "schedule:run",
      description: "Ejecuta tareas programadas pendientes (poner en Cron del servidor).",
      examples: ["php artisan schedule:run"],
      tags: ["schedule", "cron"]
    },
    {
      name: "schedule:list",
      description: "Lista tareas programadas.",
      examples: ["php artisan schedule:list"],
      tags: ["schedule", "info"]
    },
    {
      name: "schedule:work",
      description: "Ejecuta el scheduler localmente sin necesidad de Cron.",
      examples: ["php artisan schedule:work"],
      tags: ["schedule", "dev"]
    },
    {
      name: "schedule:test",
      description: "Permite probar una tarea programada inmediatamente.",
      examples: ["php artisan schedule:test"],
      tags: ["schedule", "debug"]
    }
  ],
  "Auth & Security": [
    {
      name: "key:generate",
      description: "Genera la APP_KEY.",
      examples: ["php artisan key:generate"],
      tags: ["setup"]
    },
    {
      name: "sanctum:prune-expired",
      description: "Elimina tokens de Sanctum expirados.",
      examples: ["php artisan sanctum:prune-expired"],
      tags: ["auth", "limpieza"]
    }
  ],
  "Vendor & Stubs": [
    {
      name: "vendor:publish",
      description: "Publica archivos de paquetes (configs, vistas, assets) para poder modificarlos.",
      examples: [
        "php artisan vendor:publish",
        "php artisan vendor:publish --tag=filament-config",
        "php artisan vendor:publish --provider=\"Laravel\\Sanctum\\SanctumServiceProvider\"",
        "php artisan vendor:publish --all"
      ],
      tags: ["package", "config"]
    },
    {
      name: "stub:publish",
      description: "Publica los 'stubs' (plantillas de código) que usa 'make:' para que puedas personalizar cómo se genera el código.",
      examples: ["php artisan stub:publish"],
      tags: ["customization", "avanzado"]
    },
    {
      name: "package:discover",
      description: "Reconstruye el archivo de manifiesto de paquetes detectados.",
      examples: ["php artisan package:discover"],
      tags: ["package", "fix"]
    }
  ]
};

export const categoryIcons: Record<string, string> = {
  "Generales": "⚡",
  "Make (Generadores)": "🏗️",
  "Filament (Admin Panel)": "🚀",
  "Livewire": "🔌",
  "Database & Migrate": "🗄️",
  "Cache": "💾",
  "Config & Env": "⚙️",
  "Queue & Jobs": "📬",
  "Route": "🛤️",
  "Storage & View": "👁️",
  "Events": "🔔",
  "Schedule": "⏰",
  "Auth & Security": "🔐",
  "Vendor & Stubs": "📦"
};