# 🌌 Star Wars Holocron

> **Toda la información del universo Star Wars en un solo lugar: Catálogo Interactivo & API REST Open Source servida en el Edge.**

**Star Wars Holocron** nació con una misión clara: construir el archivo abierto más completo de Star Wars con **364 personajes**, retratos en alta definición, datos físicos, planetas, películas, series y una **API REST gratuita** sin límites ni llaves de acceso.

Es un proyecto **100% Open Source y abierto a colaboradores**. Si quieres sumar personajes, completar imágenes faltantes o impulsar los módulos de Planetas, Películas y Armas, ¡tus Pull Requests son bienvenidos!

---

## ✨ Características Principales

- **364 Perfiles con Retratos HD Integrados:** A diferencia de las APIs tradicionales de solo texto, cada personaje incluye su retrato local, historia, especie, planeta natal y apariciones en películas y series.
- **API REST en el Edge (`~0ms`):** Dataset cargado directamente en memoria local sin dependencias externas frágiles ni necesidad de API Keys.
- **Terminal Sandbox Interactiva en Vivo:** Editor de código híbrido en la página principal para probar consultas en `JavaScript`, `cURL` y `Python` en tiempo real.
- **Filtros Avanzados:** Búsqueda por nombre, `slug`, planeta (`?planet=Tatooine`), especie (`?species=Droid`), texto libre (`?q=skywalker`) o personajes sin foto para colaboradores (`?missing=1`).
- **Documentación Integrada con Starlight:** Guía interactiva en `/introduccion`.

---

## 🏗️ Arquitectura del Proyecto (`core/`, `modules/`, `components/`)

El proyecto combina **Clean Architecture** para la lógica de dominio y **Screaming Architecture** para los módulos de negocio:

```text
src/
├── core/                         # Lógica de negocio pura y casos de uso
│   └── characters/
│       ├── domain/               # Entidad Character e interfaz ICharacterRepository
│       ├── application/          # Casos de uso (GetCharacters, GetCharacterById) y CharacterDTO
│       ├── infrastructure/       # LocalCharacterRepository (filtros, búsqueda y paginación en memoria)
│       └── index.ts              # Punto único de exportación e inyección
│
├── modules/                      # Módulos por feature (Screaming Architecture)
│   └── characters/
│       ├── data/                 # Dataset de 364 personajes
│       ├── components/           # CharacterCard.astro, CharacterGrid.astro, CharacterModal.astro
│       └── types/                # Contratos y tipos del módulo
│
├── components/                   # Componentes globales y de páginas
│   ├── ui/                       # Link.astro, Logo.astro, SectionContainer.astro, NavItem.astro, icons/
│   ├── layout/                   # Header.astro, Footer.astro, SEO.astro, Cursor.astro, SmoothScroll.astro
│   └── home/                     # Hero.astro, DevTerminal.astro, CommunitySection.astro, ArchiveSectors.astro
│
├── lib/                          # Animaciones y motores gráficos (Three.js Starfield, GSAP)
├── pages/                        # Rutas de Astro y endpoints REST (/api/characters)
└── styles/                       # Sistema de diseño y paleta semántica en Tailwind CSS v4 (@theme)
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework & SSR** | Astro 7 + `@astrojs/vercel` |
| **Estilos & Sistema de Diseño** | Tailwind CSS v4 (`@theme` con tokens semánticos) |
| **Documentación API** | Astro Starlight |
| **Gráficos 3D & Animaciones** | Three.js (Starfield interactivo), GSAP 3, Lenis Smooth Scroll |
| **Lenguaje** | TypeScript (Strict Mode) |

---

## 🚀 Endpoints Principales de la API

### 1. Listar y filtrar personajes
```http
GET /api/characters?page=1&limit=24&q=skywalker&species=Human&planet=Tatooine
```

### 2. Obtener un personaje por ID o Slug
```http
GET /api/characters/1
GET /api/characters/ahsoka-tano
```

---

## 💻 Instalación y Desarrollo Local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo (http://localhost:4321)
pnpm run dev

# 3. Verificar tipos de Astro y TypeScript
npx astro check

# 4. Compilar para producción (Vercel)
pnpm run build
```

---

## 🤝 ¿Cómo Colaborar?

¡Queremos que este archivo tenga **toda la información de Star Wars**! Puedes colaborar de varias formas:

1. **Completar retratos faltantes:** Entra a `/characters?missing=1` para ver qué personajes aún no tienen imagen y súbela en `public/images/characters/`.
2. **Enriquecer fichas de personajes:** Edita `src/data/characters.json` para agregar descripciones, planetas o afiliaciones.
3. **Impulsar nuevos módulos:** Ayúdanos a construir los datasets y endpoints de **Planetas** (`/planets`), **Películas & Series** (`/movies`) y **Armería & Flotas** (`/weapons`).

### Pasos para enviar tu Pull Request:
1. Haz un **Fork** de este repositorio.
2. Crea una rama para tu mejora (`git checkout -b feat/nuevo-personaje`).
3. Haz commit de tus cambios (`git commit -m "feat: agregar retrato y bio"`).
4. Abre un **Pull Request** hacia la rama principal.

---

## 📝 Licencia

Distribuido bajo licencia **MIT**. Desarrollado por [**Ezequiel Suarez**](https://www.ezequielsuarez-dev.com/) y la comunidad Open Source.
*Star Wars y todos sus personajes, logotipos e imágenes son marcas registradas de Lucasfilm Ltd. y The Walt Disney Company.*
