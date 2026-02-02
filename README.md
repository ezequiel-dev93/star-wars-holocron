# Star Wars Holocron 🪐

Una aplicación web moderna del universo Star Wars con arquitectura limpia y stack tecnológico completo.

## 🚀 Stack Tecnológico

- **Frontend**: Astro, React, TypeScript, Tailwind CSS
- **Animaciones**: GSAP, Framer Motion
- **Backend**: Astro API Endpoints, Supabase (PostgreSQL)
- **Cloud**: AWS S3 + CloudFront (imágenes)
- **Estado**: React Query, Zustand
- **UI**: shadcn/ui, Sonner, DnD Kit

## 🏗️ Arquitectura

Este proyecto implementa **Screaming Architecture** (Clean Architecture) con Astro.

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación detallada.

## 🛠️ Desarrollo

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Preview de producción
pnpm preview
```

## 📁 Estructura del Proyecto

```
src/
├── pages/           # Páginas Astro y API endpoints
├── layouts/         # Layouts Astro
├── domain/          # Entidades e interfaces
├── application/     # Casos de uso
├── infrastructure/  # Repositorios y servicios externos
├── presentation/    # Componentes React (Islands)
├── lib/            # Utilidades compartidas
└── styles/         # Estilos globales
```