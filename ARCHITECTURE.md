# Arquitectura — Star Wars Holocron

## Tabla de Contenidos
1. Visión General
2. Principios Arquitectónicos: Clean Architecture + Screaming Architecture
3. POO, Principios SOLID y Patrones de Diseño en `src/core/`
4. Estructura de Carpetas Completa
5. Capas del Sistema (`core/`, `modules/`, `components/`, `lib/`)
6. Flujo de Datos End-to-End
7. Sistema de Diseño & Paleta Semántica (`@theme`)
8. Guía para Agregar un Nuevo Módulo (Ej: Planetas o Naves)
9. Checklist de Contribución (PRs)

---

## 1. Visión General

**Star Wars Holocron** es una plataforma web y API REST Open Source construida sobre **Astro 7 + TypeScript + Tailwind CSS v4**, diseñada para reunir toda la información del universo Star Wars con latencia `~0ms` en el Edge.

Su arquitectura separa estrictamente:
- **`src/core/`**: Lógica de negocio pura, entidades POO ricas, casos de uso y contratos (Clean Architecture).
- **`src/modules/`**: Recursos, datasets, tipos y vistas específicas de cada dominio de Star Wars (Screaming Architecture).
- **`src/components/`**: Componentes transversales de interfaz (`ui/`, `layout/`, `home/`).
- **`src/lib/`**: Motores de animación y renderizado 3D (Three.js y GSAP).

| Área | Tecnología |
|---|---|
| **Framework & SSR** | Astro 7 + `@astrojs/vercel` |
| **Lenguaje** | TypeScript (Strict Mode) |
| **Estilos & Tokens** | Tailwind CSS v4 (`@theme` semántico) |
| **Documentación API** | Astro Starlight |
| **3D & Animaciones** | Three.js (`Starfield.ts`), GSAP 3, Lenis Smooth Scroll |

---

## 2. Principios Arquitectónicos

### A. Clean Architecture en `src/core/`
La regla de dependencia es inquebrantable: **las dependencias apuntan siempre hacia adentro (hacia `domain/`)**.
- `domain/` no conoce nada de Astro, ni del JSON local, ni de HTTP.
- `application/` solo conoce a `domain/` y expone **Casos de Uso** y **DTOs**.
- `infrastructure/` implementa las interfaces definidas por `domain/`.

### B. Screaming Architecture en `src/modules/`
Al abrir `src/modules/`, la estructura grita los dominios del universo Star Wars (`characters/`, y futuramente `planets/`, `movies/`, `weapons/`), manteniendo sus propios datos (`data/`), componentes de dominio (`components/`) y contratos (`types/`).

---

## 3. POO, Principios SOLID y Patrones de Diseño en `src/core/`

Toda la lógica compleja del sistema se concentra en `src/core/` combinando **Programación Orientada a Objetos (POO)**, **SOLID** y **Patrones de Diseño clásicos**:

### 1. POO — Modelo de Dominio Rico (`Character.ts`)
Evitamos el antipatrón de *Modelo de Dominio Anémico* (clases que solo tienen propiedades sin comportamiento). La entidad [`Character`](src/core/characters/domain/Character.ts) encapsula tanto sus datos inmutables (`readonly`) como sus reglas de negocio:
- `hasKnownHeight()` y `getHeightInCm()`: validación y conversión segura de datos físicos.
- `isHuman()` y `isMissingPortrait()`: reglas de clasificación del dominio.
- `matchesIdentifier(idOrSlug)`: resolución polimórfica por ID numérico, `slug` o nombre exacto.
- `matchesQuery(rawQuery)` y `matchesCriteria(criteria)`: evaluación de criterios de búsqueda y filtrado multicampo directamente en la entidad.

### 2. Principios SOLID Aplicados

- **S — Single Responsibility Principle (Responsabilidad Única):**
  - [`Character.ts`](src/core/characters/domain/Character.ts): Reglas de negocio de un personaje.
  - [`CharacterDTO.ts`](src/core/characters/application/dtos/CharacterDTO.ts): Serialización y mapeo hacia la capa de presentación/API (`toCharacterDTO`).
  - [`GetCharacters.ts`](src/core/characters/application/use-cases/GetCharacters.ts) y [`GetCharacterById.ts`](src/core/characters/application/use-cases/GetCharacterById.ts): Orquestación de casos de uso.
  - [`LocalCharacterRepository.ts`](src/core/characters/infrastructure/LocalCharacterRepository.ts): Lectura, hidratación y paginación desde la fuente de datos.
- **O — Open/Closed Principle (Abierto/Cerrado):**
  - El objeto de criterios [`CharacterFilterParams`](src/core/characters/domain/ICharacterRepository.ts) permite extender nuevos filtros (`species`, `planet`, `gender`, `missingImage`, `query`) sin cambiar la firma de los Casos de Uso ni romper los controladores API.
- **L — Liskov Substitution Principle (Sustitución de Liskov):**
  - Cualquier clase que implemente [`ICharacterRepository`](src/core/characters/domain/ICharacterRepository.ts) (`LocalCharacterRepository`, o en el futuro `PostgresCharacterRepository`) puede sustituirse en `src/core/characters/index.ts` sin alterar ni una sola línea de `GetCharacters`, `GetCharacterById`, páginas o endpoints.
- **I — Interface Segregation Principle (Segregación de Interfaces):**
  - Contratos granulares y enfocados: `ICharacterRepository`, `CharacterFilterParams`, `PaginatedResult<T>`.
- **D — Dependency Inversion Principle (Inversión de Dependencias):**
  - Los Casos de Uso (`GetCharacters`, `GetCharacterById`) dependen únicamente de la interfaz `ICharacterRepository`, jamás de `LocalCharacterRepository`.

### 3. Patrones de Diseño Implementados

| Patrón | Ubicación | Propósito |
|---|---|---|
| **Repository Pattern** | `ICharacterRepository` + `LocalCharacterRepository` | Abstrae el origen de los datos (memoria local hoy, base de datos mañana). |
| **Use Case / Command Pattern** | `GetCharacters`, `GetCharacterById` | Encapsula cada operación del sistema con un método único `.execute(...)`. |
| **Criteria / Specification Pattern** | `CharacterFilterParams` + `Character.matchesCriteria()` | Permite combinar múltiples filtros dinámicos (`query`, `species`, `planet`, `gender`, `missingImage`) de forma declarativa. |
| **DTO & Data Mapper Pattern** | `CharacterDTO` + `toCharacterDTO()` + `mapRawToDomain()` | Desacopla el formato crudo del JSON (`RawCharacterRecord`) de la Entidad de Dominio (`Character`) y de la respuesta pública de la API (`CharacterDTO`). |
| **Composition Root (DI)** | `src/core/characters/index.ts` | Único punto donde se instancia `LocalCharacterRepository` y se inyecta en los Casos de Uso. |

---

## 4. Estructura de Carpetas Completa

```text
src/
├── core/                                     # Clean Architecture (Lógica de negocio pura)
│   └── characters/
│       ├── domain/
│       │   ├── Character.ts                  # Entidad POO rica con reglas de negocio
│       │   └── ICharacterRepository.ts       # Contrato del repositorio + CharacterFilterParams
│       ├── application/
│       │   ├── dtos/
│       │   │   └── CharacterDTO.ts           # Contrato de salida + Mapper toCharacterDTO()
│       │   └── use-cases/
│       │       ├── GetCharacters.ts          # Caso de uso: listar, buscar y filtrar
│       │       └── GetCharacterById.ts       # Caso de uso: obtener por ID o slug
│       ├── infrastructure/
│       │   └── LocalCharacterRepository.ts   # Implementación en memoria local (0ms Edge)
│       └── index.ts                          # Composition Root (Inyección de dependencias)
│
├── modules/                                  # Screaming Architecture (Módulos por dominio)
│   └── characters/
│       ├── data/
│       │   └── index.ts                      # Acceso tipado al dataset de personajes
│       ├── components/
│       │   ├── CharacterCard.astro           # Tarjeta de personaje
│       │   ├── CharacterGrid.astro           # Grilla responsiva
│       │   └── CharacterModal.astro          # Inspector de ficha completa + visor JSON
│       └── types/
│           └── character.types.ts            # Tipos de datos crudos y contratos de vista
│
├── components/                               # Componentes transversales y de páginas
│   ├── ui/
│   │   ├── Link.astro                        # Componente polimórfico de enlaces y botones
│   │   ├── Logo.astro                        # Identidad visual hexagonal del Holocron
│   │   ├── SectionContainer.astro            # Contenedor de ancho estándar
│   │   ├── NavItem.astro                     # Ítem de navegación
│   │   └── icons/                            # Íconos SVG (DocsIcon, MenuIcon, CloseIcon)
│   ├── layout/
│   │   ├── Header.astro                      # Navegación superior Glassmorphism
│   │   ├── Footer.astro                      # Pie de página
│   │   ├── SEO.astro                         # Metadatos OpenGraph, Twitter y Favicon
│   │   ├── Cursor.astro                      # Cursor interactivo Kyber con GSAP
│   │   └── SmoothScroll.astro                # Integración de Lenis + GSAP
│   └── home/
│       ├── Hero.astro                        # Portada con Starfield 3D y dossier en vivo
│       ├── DevTerminal.astro                 # Sandbox interactivo con editor de código en vivo
│       ├── CommunitySection.astro            # Propósito del proyecto y guía de colaboración
│       └── ArchiveSectors.astro              # Tarjetas de navegación por sectores
│
├── lib/                                      # Motores gráficos y utilidades de animación
│   ├── three/
│   │   └── Starfield.ts                      # Simulación de partículas 3D en Three.js
│   └── gsap/
│       └── index.ts                          # Configuración de GSAP
│
├── pages/                                    # Rutas de Astro y Endpoints REST
│   ├── index.astro                           # Página principal (compuesta desde @components/*)
│   ├── characters.astro                      # Catálogo interactivo con filtros
│   ├── planets.astro                         # Sector de Planetas
│   ├── movies.astro                          # Sector de Películas & Series
│   ├── weapons.astro                         # Sector de Armería & Flotas
│   └── api/
│       └── characters/
│           ├── index.ts                      # GET /api/characters
│           └── [id].ts                       # GET /api/characters/[id]
│
└── styles/
    ├── global.css                            # Paleta semántica (@theme) y capas base (@layer)
    └── starlight.css                         # Tema personalizado para la documentación
```

---

## 5. Flujo de Datos End-to-End

Tanto las páginas SSR (`src/pages/characters.astro`) como los endpoints de la API (`src/pages/api/characters/index.ts`) siguen exactamente el mismo flujo desacoplado:

```text
Cliente (Navegador / fetch en DevTerminal)
    │
    ▼
Astro Page (characters.astro) o API Route (/api/characters)
    │  importa el Caso de Uso desde @core/characters
    ▼
GetCharacters.execute(criteria)  [Application Layer]
    │  invoca mediante interfaz
    ▼
ICharacterRepository.filter(criteria)  [Domain Contract]
    │  implementado por
    ▼
LocalCharacterRepository  [Infrastructure Layer]
    │  delega la regla de negocio a cada entidad
    ▼
Character.matchesCriteria(criteria)  [Domain Entity - POO]
    │  transforma con toCharacterDTO()
    ▼
PaginatedCharactersDTO  ──►  Renderizado HTML (SSR) o Respuesta JSON (API)
```

> **Regla clave:** Ninguna página ni endpoint importa jamás `LocalCharacterRepository` directamente; siempre consumen los casos de uso (`getCharactersUseCase`, `getCharacterByIdUseCase`) exportados por el Composition Root (`@core/characters`).

---

## 6. Sistema de Diseño & Paleta Semántica (`@theme`)

En [`src/styles/global.css`](src/styles/global.css) definimos los tokens semánticos con `@theme` de Tailwind CSS v4 para prohibir el uso de colores hexadecimales quemados (como `bg-[#0E0E0E]`) en los componentes:

- **Fondos:** `bg-base` (`#0A0A0A`), `bg-deep` (`#060606`), `bg-surface` (`#121212`), `bg-card` (`#0E0E0E`), `bg-elevated` (`#181818`)
- **Textos:** `text-primary` (`#F8FFF0`), `text-muted` (`#A3A3A3`), `text-dim` (`#666666`), `text-accent` (`#7FFFD4`)
- **Bordes:** `border-subtle` (`#262626`), `border-smoke` (`#3D3D3D`), `border-accent` (`#7FFFD4`)
- **Tipografías:** `font-orbitron`, `font-inter`, `font-mono`
- **Enlaces y Botones:** Centralizados en [`src/components/ui/Link.astro`](src/components/ui/Link.astro) con variantes `primary`, `secondary`, `outline`, `ghost`, `inline`, `nav` y `unstyled`.

---

## 7. Guía para Agregar un Nuevo Módulo (Ej: `planets`)

1. **Crear el núcleo en `src/core/planets/`:**
   - `domain/Planet.ts` (Entidad POO con sus validaciones y `matchesCriteria`).
   - `domain/IPlanetRepository.ts` (Interfaz del repositorio).
   - `application/dtos/PlanetDTO.ts` + `toPlanetDTO()`.
   - `application/use-cases/GetPlanets.ts` y `GetPlanetById.ts`.
   - `infrastructure/LocalPlanetRepository.ts`.
   - `index.ts` (Composition Root exportando `getPlanetsUseCase` y `getPlanetByIdUseCase`).
2. **Crear el módulo en `src/modules/planets/`:**
   - `data/` (Dataset JSON), `types/` y `components/` (`PlanetCard.astro`, `PlanetGrid.astro`).
3. **Exponer las rutas en `src/pages/`:**
   - `src/pages/planets.astro` y `src/pages/api/planets/index.ts`.

---

## 8. Checklist de Contribución (PRs)

- [ ] La lógica de negocio vive en `src/core/<modulo>/` y no en las páginas `.astro`.
- [ ] Las páginas y endpoints consumen únicamente los Casos de Uso exportados desde `@core/<modulo>`.
- [ ] Los componentes usan la paleta semántica (`bg-card`, `text-primary`, `text-accent`, `border-smoke`) sin colores hexadecimales harcodeados.
- [ ] Los enlaces utilizan el componente `<Link />` (`@components/ui/Link.astro`).
- [ ] `npx astro check` finaliza con `0 errors`, `0 warnings` y `0 hints`.
