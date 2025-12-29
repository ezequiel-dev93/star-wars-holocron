# 🏛️ Arquitectura del Proyecto - Star Wars Catalog

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Principios Arquitectónicos](#principios-arquitectónicos)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Capas de la Arquitectura](#capas-de-la-arquitectura)
5. [Flujo de Datos](#flujo-de-datos)
6. [Guías de Implementación](#guías-de-implementación)
7. [Convenciones y Best Practices](#convenciones-y-best-practices)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## 🎯 Visión General

Este proyecto implementa un **Catálogo Interactivo de Star Wars** utilizando **Screaming Architecture** (Clean Architecture) con Next.js 14.

### Objetivos del Proyecto

- ✅ Construir una API REST personalizada que extiende y enriquece datos de SWAPI
- ✅ Implementar Screaming Architecture + Principios SOLID
- ✅ Integrar múltiples servicios externos (SWAPI, Supabase, AWS S3)
- ✅ Crear una interfaz moderna y animada (GSAP + Framer Motion)
- ✅ Desplegar una aplicación full-stack en producción (Vercel)

### Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Animaciones:** GSAP, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Storage:** AWS S3 + CloudFront
- **External API:** SWAPI (Star Wars API)
- **Deployment:** Vercel

---

## 🧩 Principios Arquitectónicos

### 1. Screaming Architecture

La estructura del proyecto "grita" su propósito: **"SOY UN CATÁLOGO DE STAR WARS"**

```
src/
├── domain/          # El CORE grita "Characters, Planets, Species"
├── application/     # Los casos de uso son evidentes
├── infrastructure/  # Detalles de implementación ocultos
└── presentation/    # UI separada del negocio
```

### 2. SOLID Principles

#### **S - Single Responsibility Principle**
Cada clase/módulo tiene una única razón para cambiar:
- `Character.ts` → Solo define la entidad Character
- `GetCharacters.ts` → Solo obtiene listado de personajes
- `SwapiClient.ts` → Solo se comunica con SWAPI

#### **O - Open/Closed Principle**
Abierto a extensión, cerrado a modificación:
```typescript
// ✅ Fácil cambiar de SWAPI a otra API sin tocar el domain
interface ICharacterRepository {
  findAll(): Promise<Character[]>
}

class SwapiCharacterRepository implements ICharacterRepository { }
class AlternativeAPIRepository implements ICharacterRepository { }
```

#### **L - Liskov Substitution Principle**
Las implementaciones son intercambiables:
```typescript
// Cualquier repositorio funciona igual
const repo: ICharacterRepository = new SwapiCharacterRepository()
// o
const repo: ICharacterRepository = new SupabaseCharacterRepository()
```

#### **I - Interface Segregation Principle**
Interfaces específicas y pequeñas:
```typescript
interface ICharacterRepository { }  // Solo para Characters
interface IPlanetRepository { }     // Solo para Planets
```

#### **D - Dependency Inversion Principle**
El domain NO depende de infrastructure:
```typescript
// ❌ MAL: Domain importa de Infrastructure
import { SwapiClient } from '@/infrastructure/services/swapi'

// ✅ BIEN: Domain usa interfaces
import { ICharacterRepository } from '@/domain/repositories'
```

---

## 📁 Estructura de Carpetas

```
src/
├── domain/                      # 💎 CORE - Lógica de negocio pura
│   ├── entities/                # Modelos del dominio
│   ├── value-objects/           # Objetos de valor inmutables
│   └── repositories/            # Interfaces (contratos)
│
├── application/                 # ⚙️ Casos de uso
│   ├── use-cases/               # Lógica de aplicación
│   ├── dtos/                    # Data Transfer Objects
│   └── services/                # Orquestación de casos de uso
│
├── infrastructure/              # 🔧 Implementaciones concretas
│   ├── repositories/            # Implementaciones de interfaces
│   ├── services/                # Clientes externos (SWAPI, Supabase, S3)
│   └── cache/                   # Estrategias de caché
│
├── presentation/                # 🎨 UI Layer
│   ├── components/              # Componentes React
│   ├── hooks/                   # Custom hooks
│   └── animations/              # Configuración de animaciones
│
├── app/                         # Next.js 14 App Router
│   ├── api/                     # API Routes
│   └── [pages]/                 # Páginas de la aplicación
│
├── config/                      # Configuración
└── lib/                         # Utilidades compartidas
```

---

## 🏗️ Capas de la Arquitectura

### 1. Domain Layer (💎 CORE)

**Responsabilidad:** Define las reglas de negocio puras, independientes de cualquier framework o tecnología.

**Ubicación:** `src/domain/`

**Reglas:**
- ❌ NO puede importar de otras capas
- ❌ NO puede depender de frameworks (React, Next.js)
- ✅ Solo contiene lógica de negocio pura
- ✅ Define interfaces, no implementaciones

**Ejemplo:**

```typescript
// src/domain/entities/Character.ts
export class Character {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: CharacterStatus,
    public readonly species: string
  ) {}

  isAlive(): boolean {
    return this.status === CharacterStatus.ALIVE
  }
}

// src/domain/repositories/ICharacterRepository.ts
export interface ICharacterRepository {
  findAll(page: number): Promise<Character[]>
  findById(id: string): Promise<Character | null>
  search(query: string): Promise<Character[]>
}
```

---

### 2. Application Layer (⚙️ Casos de Uso)

**Responsabilidad:** Orquesta la lógica de aplicación. Coordina entre Domain e Infrastructure.

**Ubicación:** `src/application/`

**Reglas:**
- ✅ Puede importar de `domain/`
- ✅ Usa interfaces de `domain/repositories/`
- ❌ NO importa implementaciones concretas de `infrastructure/`
- ✅ Define DTOs para comunicación con Presentation

**Ejemplo:**

```typescript
// src/application/use-cases/characters/GetCharacters.ts
import { ICharacterRepository } from '@/domain/repositories/ICharacterRepository'
import { CharacterDTO } from '@/application/dtos/CharacterDTO'

export class GetCharacters {
  constructor(private characterRepository: ICharacterRepository) {}

  async execute(page: number = 1): Promise<CharacterDTO[]> {
    const characters = await this.characterRepository.findAll(page)
    return characters.map(char => CharacterDTO.fromEntity(char))
  }
}
```

---

### 3. Infrastructure Layer (🔧 Implementaciones)

**Responsabilidad:** Implementa los detalles técnicos. Se comunica con APIs externas, bases de datos, etc.

**Ubicación:** `src/infrastructure/`

**Reglas:**
- ✅ Implementa interfaces de `domain/repositories/`
- ✅ Puede importar de `domain/`
- ✅ Contiene toda la lógica de comunicación externa
- ❌ NO es importada directamente por `application/` (solo via interfaces)

**Ejemplo:**

```typescript
// src/infrastructure/repositories/SwapiCharacterRepository.ts
import { ICharacterRepository } from '@/domain/repositories/ICharacterRepository'
import { Character } from '@/domain/entities/Character'
import { SwapiClient } from '@/infrastructure/services/swapi/SwapiClient'

export class SwapiCharacterRepository implements ICharacterRepository {
  constructor(private swapiClient: SwapiClient) {}

  async findAll(page: number): Promise<Character[]> {
    const response = await this.swapiClient.getCharacters(page)
    return response.results.map(data => this.mapToEntity(data))
  }

  async findById(id: string): Promise<Character | null> {
    const data = await this.swapiClient.getCharacterById(id)
    return data ? this.mapToEntity(data) : null
  }

  private mapToEntity(data: any): Character {
    // Transformación de SWAPI data a Character entity
    return new Character(/* ... */)
  }
}
```

---

### 4. Presentation Layer (🎨 UI)

**Responsabilidad:** Componentes React, hooks, y lógica de UI.

**Ubicación:** `src/presentation/`

**Reglas:**
- ✅ Puede usar `application/use-cases/` (via API Routes)
- ✅ Trabaja solo con DTOs
- ❌ NO conoce entities del domain directamente
- ✅ Solo responsabilidades de UI

**Organización:**

```
src/presentation/components/
├── characters/           # Componentes específicos
│   ├── CharacterCard.tsx
│   ├── CharacterModal.tsx
│   └── CharacterGrid.tsx
│
├── shared/               # Componentes reutilizables
│   ├── ui/               # Atoms (Button, Card, Input)
│   ├── feedback/         # Loading, Error, Toast
│   └── navigation/       # SearchBar, Pagination
│
└── layout/               # Estructura de páginas
    ├── Header.tsx
    ├── Footer.tsx
    └── Container.tsx
```

**Ejemplo:**

```typescript
// src/presentation/components/characters/CharacterCard.tsx
import { CharacterDTO } from '@/application/dtos/CharacterDTO'

interface CharacterCardProps {
  character: CharacterDTO  // Solo DTO, no Entity
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className="card">
      <h3>{character.name}</h3>
      <span>{character.status}</span>
    </div>
  )
}
```

---

## 🔄 Flujo de Datos

### Flujo Completo: Click → JSON Response

```
User Click
    ↓
Next.js Component (Presentation)
    ↓
API Route (/app/api/characters/[id]/route.ts)
    ↓
Use Case (GetCharacterById)
    ↓
Repository Interface (ICharacterRepository)
    ↓
Repository Implementation (SwapiCharacterRepository + SupabaseCharacterRepository)
    ↓
External Services (SWAPI + Supabase + S3)
    ↓
Entity (Character)
    ↓
DTO (CharacterDTO)
    ↓
JSON Response
    ↓
Component Update
```

### Ejemplo Práctico

#### 1. Usuario hace click en una card

```typescript
// src/presentation/components/characters/CharacterCard.tsx
<div onClick={() => router.push(`/characters/${character.id}`)}>
  {character.name}
</div>
```

#### 2. Next.js navega a la página

```typescript
// src/app/characters/[id]/page.tsx
export default async function CharacterPage({ params }: { params: { id: string } }) {
  const response = await fetch(`/api/characters/${params.id}`)
  const character = await response.json()
  
  return <CharacterDetails character={character} />
}
```

#### 3. API Route ejecuta el Use Case

```typescript
// src/app/api/characters/[id]/route.ts
import { GetCharacterById } from '@/application/use-cases/characters/GetCharacterById'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const useCase = new GetCharacterById(
    new SwapiCharacterRepository(),
    new SupabaseCharacterRepository()
  )
  
  const character = await useCase.execute(params.id)
  return Response.json(character)
}
```

#### 4. Use Case orquesta los repositorios

```typescript
// src/application/use-cases/characters/GetCharacterById.ts
export class GetCharacterById {
  constructor(
    private swapiRepo: ICharacterRepository,
    private supabaseRepo: ICharacterRepository
  ) {}

  async execute(id: string): Promise<CharacterDTO> {
    // Obtener datos base de SWAPI
    const character = await this.swapiRepo.findById(id)
    
    // Enriquecer con datos custom de Supabase
    const customData = await this.supabaseRepo.findById(id)
    
    // Combinar y retornar DTO
    return CharacterDTO.fromEntity(character, customData)
  }
}
```

---

## 📝 Guías de Implementación

### Agregar una Nueva Feature

#### Ejemplo: Agregar "Starships" (Naves Espaciales)

**1. Domain Layer**

```typescript
// src/domain/entities/Starship.ts
export class Starship {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly model: string,
    public readonly manufacturer: string
  ) {}
}

// src/domain/repositories/IStarshipRepository.ts
export interface IStarshipRepository {
  findAll(): Promise<Starship[]>
  findById(id: string): Promise<Starship | null>
}
```

**2. Application Layer**

```typescript
// src/application/use-cases/starships/GetStarships.ts
export class GetStarships {
  constructor(private starshipRepository: IStarshipRepository) {}
  
  async execute(): Promise<StarshipDTO[]> {
    const starships = await this.starshipRepository.findAll()
    return starships.map(s => StarshipDTO.fromEntity(s))
  }
}

// src/application/dtos/StarshipDTO.ts
export class StarshipDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly model: string
  ) {}
  
  static fromEntity(starship: Starship): StarshipDTO {
    return new StarshipDTO(starship.id, starship.name, starship.model)
  }
}
```

**3. Infrastructure Layer**

```typescript
// src/infrastructure/repositories/SwapiStarshipRepository.ts
export class SwapiStarshipRepository implements IStarshipRepository {
  async findAll(): Promise<Starship[]> {
    // Implementación
  }
}
```

**4. Presentation Layer**

```typescript
// src/presentation/components/starships/StarshipCard.tsx
export function StarshipCard({ starship }: { starship: StarshipDTO }) {
  return <div>{starship.name}</div>
}
```

**5. API Route**

```typescript
// src/app/api/starships/route.ts
export async function GET() {
  const useCase = new GetStarships(new SwapiStarshipRepository())
  const starships = await useCase.execute()
  return Response.json(starships)
}
```

**6. Page**

```typescript
// src/app/starships/page.tsx
export default async function StarshipsPage() {
  const response = await fetch('/api/starships')
  const starships = await response.json()
  
  return <StarshipGrid starships={starships} />
}
```

---

### Cambiar un Servicio Externo

#### Ejemplo: Cambiar de SWAPI a otra API

**Gracias a la arquitectura, solo cambias Infrastructure:**

```typescript
// src/infrastructure/repositories/AlternativeAPICharacterRepository.ts
export class AlternativeAPICharacterRepository implements ICharacterRepository {
  // Nueva implementación
  async findAll(page: number): Promise<Character[]> {
    // Llama a la nueva API
  }
}

// En tu API Route, solo cambias la instancia:
// ANTES:
const repo = new SwapiCharacterRepository()

// DESPUÉS:
const repo = new AlternativeAPICharacterRepository()

// ¡El resto del código NO cambia! 🎉
```

---

## ✅ Convenciones y Best Practices

### Naming Conventions

#### Archivos y Carpetas
- **PascalCase** para componentes: `CharacterCard.tsx`
- **camelCase** para utilities: `validators.ts`
- **kebab-case** para carpetas multi-palabra: `use-cases/`

#### Código
- **Interfaces:** Prefijo `I` → `ICharacterRepository`
- **DTOs:** Sufijo `DTO` → `CharacterDTO`
- **Entities:** Nombre simple → `Character`
- **Use Cases:** Verbo + Noun → `GetCharacters`, `CreateCharacter`

### Imports

**Usar path aliases:**

```typescript
// ✅ BIEN
import { Character } from '@/domain/entities/Character'
import { GetCharacters } from '@/application/use-cases/characters/GetCharacters'

// ❌ MAL
import { Character } from '../../../domain/entities/Character'
```

**Orden de imports:**

```typescript
// 1. External packages
import React from 'react'
import { useRouter } from 'next/navigation'

// 2. Domain
import { Character } from '@/domain/entities/Character'

// 3. Application
import { CharacterDTO } from '@/application/dtos/CharacterDTO'

// 4. Infrastructure
import { SwapiClient } from '@/infrastructure/services/swapi/SwapiClient'

// 5. Presentation
import { CharacterCard } from '@/presentation/components/characters/CharacterCard'

// 6. Types
import type { CharacterCardProps } from './types'
```

### Manejo de Errores

```typescript
// src/lib/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

// Uso en Use Case:
if (!character) {
  throw new NotFoundError('Character')
}
```

### Validación

```typescript
// src/lib/utils/validators.ts
export function validateId(id: string): boolean {
  return /^\d+$/.test(id)
}

// Uso:
if (!validateId(params.id)) {
  throw new AppError('Invalid ID format', 400)
}
```

---

## 🧪 Testing

### Estructura de Tests

```
src/
├── domain/
│   ├── entities/
│   │   ├── Character.ts
│   │   └── Character.test.ts      # Tests unitarios
│
├── application/
│   ├── use-cases/
│   │   └── characters/
│   │       ├── GetCharacters.ts
│   │       └── GetCharacters.test.ts
│
└── presentation/
    └── components/
        └── characters/
            ├── CharacterCard.tsx
            └── CharacterCard.test.tsx
```

### Testing por Capa

#### Domain Layer (Tests Unitarios Puros)

```typescript
// src/domain/entities/Character.test.ts
import { Character } from './Character'
import { CharacterStatus } from '@/domain/value-objects/CharacterStatus'

describe('Character Entity', () => {
  it('should identify alive character', () => {
    const character = new Character('1', 'Luke', CharacterStatus.ALIVE, 'Human')
    expect(character.isAlive()).toBe(true)
  })
  
  it('should identify dead character', () => {
    const character = new Character('2', 'Vader', CharacterStatus.DEAD, 'Human')
    expect(character.isAlive()).toBe(false)
  })
})
```

#### Application Layer (Mock Repositories)

```typescript
// src/application/use-cases/characters/GetCharacters.test.ts
import { GetCharacters } from './GetCharacters'
import { ICharacterRepository } from '@/domain/repositories/ICharacterRepository'

describe('GetCharacters Use Case', () => {
  it('should return characters from repository', async () => {
    // Mock del repositorio
    const mockRepo: ICharacterRepository = {
      findAll: jest.fn().mockResolvedValue([
        new Character('1', 'Luke', CharacterStatus.ALIVE, 'Human')
      ])
    }
    
    const useCase = new GetCharacters(mockRepo)
    const result = await useCase.execute(1)
    
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Luke')
  })
})
```

#### Presentation Layer (Component Tests)

```typescript
// src/presentation/components/characters/CharacterCard.test.tsx
import { render, screen } from '@testing-library/react'
import { CharacterCard } from './CharacterCard'

describe('CharacterCard', () => {
  it('should render character name', () => {
    const character = { id: '1', name: 'Luke', status: 'alive' }
    render(<CharacterCard character={character} />)
    expect(screen.getByText('Luke')).toBeInTheDocument()
  })
})
```

---

## 🚀 Deployment

### Estructura en Vercel

```
Vercel Project
├── Frontend (Next.js SSR)
│   ├── Static pages (ISR)
│   └── Server Components
│
└── Backend (Edge Functions)
    └── API Routes (/api/*)
```

### Variables de Entorno

```env
# .env.local (desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
SWAPI_BASE_URL=https://swapi.dev/api
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
```

### Performance Optimization

#### 1. Caching Strategy

```typescript
// src/infrastructure/cache/CacheStrategy.ts
export class CacheStrategy {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private TTL = 5 * 60 * 1000 // 5 minutos
  
  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}
```

#### 2. Next.js ISR (Incremental Static Regeneration)

```typescript
// src/app/characters/page.tsx
export const revalidate = 3600 // Revalidar cada hora

export default async function CharactersPage() {
  // Esta página se regenera cada hora
}
```

---

## 📚 Recursos Adicionales

### Lecturas Recomendadas

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [Next.js 14 Documentation](https://nextjs.org/docs)

### Diagramas

Ver `/docs/architecture-diagram.jsx` para una visualización interactiva de la arquitectura.

---

## 🤝 Contribuir

### Antes de agregar código

1. **¿A qué capa pertenece?** Identifica la capa correcta
2. **¿Respeta SOLID?** Verifica que no violas principios
3. **¿Es testeable?** Asegúrate de poder escribir tests
4. **¿Sigue las convenciones?** Revisa naming y estructura

### Checklist de PR

- [ ] Los archivos están en la capa correcta
- [ ] Las dependencias fluyen en la dirección correcta (Domain ← Application ← Infrastructure)
- [ ] Se agregaron tests (cuando corresponde)
- [ ] Se actualizó la documentación (si es necesario)
- [ ] El código sigue las convenciones de naming
- [ ] No hay imports circulares

---

## 📞 Contacto

Si tienes dudas sobre la arquitectura, consulta este documento primero. Si la respuesta no está aquí, siéntete libre de abrir un issue.

**¡Que la Fuerza te acompañe!**