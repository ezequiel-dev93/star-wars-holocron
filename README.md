# Star Wars Holocron API & Web
Catálogo y API del universo Star Wars, inspirado en la Dragon Ball API, diseñado como proyecto personal de aprendizaje con foco en arquitectura de software, diseño de APIs y buenas prácticas aplicadas a un entorno realista.

El proyecto no se limita a consumir una API externa: implementa capas bien definidas, casos de uso, DTOs, adapters y principios SOLID, siguiendo Clean Architecture y Screaming Architecture incluso en frontend.

## 🎯 Objetivos del proyecto

- Diseñar APIs REST limpias y mantenibles

- Aplicar Clean Architecture + Screaming Architecture

- Profundizar en arquitectura backend y frontend

- Integrar servicios externos y cloud (SWAPI, Supabase, AWS)

- Practicar SSR, caching e ISR con Next.js

- Documentar y compartir el proceso (learning in public)


## 🧠 Arquitectura

El proyecto está organizado en capas claramente separadas, donde el dominio es independiente de los detalles de infraestructura.

Capas principales
🎨 Presentation Layer

Responsable de la UI y la interacción con el usuario.

- Next.js 16 (App Router)

- React Components (cards, modals, layouts)

- Tailwind CSS

- GSAP + Framer Motion

- SSR, ISR y Client Components

## ⚙️ Application Layer

- Contiene los casos de uso y la orquestación de la lógica.

- Use Cases (ej: GetCharacters, GetCharacterDetails)

- DTOs (Data Transfer Objects)

- Manejo centralizado de errores

- Coordinación entre múltiples servicios

## 💎 Domain Layer (Core)

- El corazón del sistema, independiente de frameworks.

- Entidades: Character, Planet, Species

- Value Objects

- Reglas de negocio

- Interfaces de repositorio

- Principios SOLID aplicados

## 🔧 Infrastructure Layer

Implementaciones concretas y dependencias externas.

- Adapter de SWAPI

- Cliente de Supabase

- AWS S3 + CloudFront

- Estrategias de cache

- Implementaciones de repositorios


## 🔁 Data Flow

Interacción del usuario en la UI

Componente React consume una API Route

API Route ejecuta un Use Case

El Use Case orquesta:

- SWAPI (datos canónicos)

- Supabase (datos custom)

- AWS S3 (imágenes)

Transformación a DTO

Respuesta JSON / renderizado en UI


| Método | Endpoint               | Descripción                        |
| ------ | ---------------------- | ---------------------------------- |
| GET    | `/api/characters`      | Lista de personajes con paginación |
| GET    | `/api/characters/[id]` | Detalle de personaje               |
| GET    | `/api/planets`         | Catálogo de planetas               |
| GET    | `/api/search`          | Búsqueda unificada                 |


## 🧰 Stack Tecnológico
Frontend

- Next.js 16 (App Router)

- React

- Tailwind CSS

- GSAP

- Framer Motion

Backend / Infraestructura

- API Routes (Next.js)

- Supabase (PostgreSQL + Auth futuro)

- AWS S3 + CloudFront

- SWAPI (API externa)


## ☁️ Deployment

El proyecto está pensado para desplegarse en Vercel:

- SSR automático

- Edge Functions para API Routes

- Incremental Static Regeneration (ISR)

- CDN global

- HTTPS automático


## 🧱 Principios aplicados

- Single Responsibility: cada capa tiene una responsabilidad clara

- Open/Closed: fácil extender sin modificar el core

- Liskov Substitution: repositorios intercambiables

- Interface Segregation: contratos específicos

- Dependency Inversion: el dominio no depende de la infraestructura

## 🚀 Estado del proyecto

🟡 En desarrollo activo
Este proyecto evoluciona de forma incremental. Se irán agregando:

- Autenticación

- Favoritos por usuario

- Nuevas entidades

- Mejoras de performance y cache

- Tests


## 🤝 Contribuciones

Las ideas, sugerencias y feedback son bienvenidos.
Si querés proponer mejoras o discutir decisiones técnicas, abrí un issue o contactame.

## 📌 Inspiración

Dragon Ball API

Clean Architecture

Screaming Architecture

Diseño de APIs REST

## 📄 Licencia

MIT


