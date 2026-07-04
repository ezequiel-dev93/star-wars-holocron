# Star Wars Holocron

> **Enterprise-Grade Knowledge Base construido con Astro, React y Screaming Architecture.**

Las aplicaciones frontend que consumen APIs externas (como SWAPI) frecuentemente sufren de alto acoplamiento, tiempos de carga lentos y lógica de negocio dispersa en la UI. **Star Wars Holocron** resuelve estos problemas proponiendo una plataforma estructurada bajo estándares *enterprise*.

Este proyecto es la demostración empírica de cómo aplicar principios **SOLID** y **Clean Architecture** (DDD Light) en el ecosistema frontend moderno para lograr una UI/UX premium sin sacrificar performance ni escalabilidad.

---

## Diferenciadores y Features Principales

- **Catálogo Interactivo y Híbrido:** Renderizado de contenido estático ultrarrápido (Astro) combinado con React Islands únicamente donde se necesita reactividad compleja (búsqueda dinámica y gestión de estado).
- **BFF (Backend For Frontend) Propio:** Endpoints integrados (`/api/characters`) que actúan como capa de abstracción y ETL ligero sobre SWAPI, resolviendo relaciones de datos en el servidor y evitando *waterfalls* en el cliente.
- **Gestión Avanzada de Estado:** Lógica de clasificación de favoritos con estructuras de datos anidadas (carpetas) consumiendo Supabase.
- **UI/UX Premium:** Animaciones complejas coreografiadas con GSAP y renderizado 3D de fondo (Three.js), manteniendo ruteo optimizado y un framerate de 60fps.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Core & Framework** | Astro 5, TypeScript |
| **UI & Islands** | React 19, Tailwind CSS v4 |
| **Data Fetching & State**| TanStack React Query, React Hook Form, Zod |
| **Infraestructura** | Supabase (PostgreSQL, Storage) |
| **Animaciones** | GSAP, Three.js |

---

## Decisiones Técnicas Clave (El "Por Qué")

Lsas herramientas son secundarias a la arquitectura. Estas son las decisiones core del proyecto:

*   **Screaming Architecture sobre Vistas Acopladas:**
    ¿Por qué no usar el típico esquema de framework (`components/`, `pages/`)? La estructura del proyecto grita el dominio (`modules/characters`). Cada entidad es un recurso autocontenido dividido en `domain`, `application` e `infrastructure`. Esto garantiza que la lógica de negocio sobreviva a cambios de framework (como de hecho ocurrió, migrando partes de Next.js a Astro sin reescribir la lógica).
*   **Islas Reactivas vs. Single Page Application (SPA):**
    Construir esto como una SPA tradicional habría castigado el *Time-To-Interactive* enviando megabytes de JavaScript innecesario. Astro envía el HTML completo estático, y solo "despierta" a React en la barra de búsqueda y filtros. El resultado es rendimiento puro al nivel del usuario.
*   **Inversión de Control y Capa HTTP Abstracta:**
    El frontend jamás habla con SWAPI directamente. Se implementó un `FetchHttpClient` inyectado por dependencias (`config/dependencies.ts`). Esto facilita la inyección de mocks para testing unario y prepara el terreno para estrategias de caché con Redis en el servidor.
*   **Storage Dinámico (Supabase Path vs URLs Absolutas):**
    Al almacenar referencias relativas de los avatares en la base de datos en lugar de la URL absoluta del CDN, el dominio se vuelve agnóstico a la infraestructura de red. Esto reduce los payloads de consultas a la DB y reduce dramáticamente el costo de refactorización si el día de mañana se migra el Storage provider.

---

## Demo

- **Live Demo:** [(Var ser desplegado en el futuro en Vercel)]

---

## Instalación y Entorno Local

```bash
# 1. Clonar e instalar dependencias
pnpm install

# 2. Configurar variables de entorno (.env)
# Requiere credenciales de Supabase (ver .env.example)

# 3. Iniciar entorno de desarrollo local
pnpm run dev

# 4. Compilar para producción (Prueba estricta de TypeScript y optimizaciones Build)
pnpm run build

El servidor arranca localmente en http://localhost:4321.

##  Aprendizajes y Evolución Continua
Aplicar de forma purista Hexagonal Architecture en frontend frontend suele incurrir en sobre-ingeniería, por lo que este proyecto adopta un enfoque "DDD Light". Fue un excelente reto aprender a balancear el pragmatismo que exige la web (velocidad de delivery) manteniendo fronteras de dominio irrompibles.

Próximas mejoras diseñadas en el Roadmap:
- Integración de End-to-End Testing (E2E) con Playwright.
- Virtualización de DOM (react-virtualized o similar) para manejar catálogos al infinito sin bloqueos de memoria.
- Caché perimetral o en memoria (Redis) en el propio BFF node/Astro.

~~~
Desarrollado por Ezequiel Suarez. Este repositorio es de códdigo abierto y parte de mi portafolio profesional.
~~~

## 📝 Licencia

Este proyecto es de código cerrado y pertenece a Ezequiel Balbuena.