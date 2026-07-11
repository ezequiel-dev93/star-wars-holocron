# Arquitectura - Star Wars Holocron

## Tabla de Contenidos
1. Vision General
2. Principios SOLID y Screaming Architecture
3. Estructura de Carpetas
4. Modulos de Dominio
5. Capas dentro de un Modulo
6. Flujo de Datos
7. Shared Layer
8. Composition Root
9. Guias de Implementacion
10. Testing

---

## Vision General

Catalogo Interactivo de Star Wars con **Screaming Architecture** (Package by Feature),
**Clean Architecture** y **SOLID**, sobre **Astro 5 + TypeScript**.

> La estructura de carpetas grita el dominio: Personajes, Naves, Planetas — no la tecnologia.

| Area | Tecnologia |
|---|---|
| Framework | Astro 5 |
| UI | React 19 (Islands), TypeScript |
| Styling | Tailwind CSS v4 |
| Animaciones | GSAP, Three.js |
| Backend | Astro API Endpoints (Node.js SSR) |
| External API | SWAPI (https://swapi.dev) |

---

## Principios Arquitectonicos

### 1. Screaming Architecture (Package by Feature)

La estructura de nivel superior comunica el **dominio del negocio**, no el patron tecnico:

```
src/
└── modules/
    ├── characters/   ← Grita Star Wars!
    ├── starships/    ← Grita Star Wars!
    ├── planets/      ← Grita Star Wars!
    └── species/      ← Grita Star Wars!
```

Cada modulo es **autocontenido** con sus propias capas (domain, application, infrastructure).

### 2. SOLID Principles

**S - Single Responsibility:** Cada clase tiene una unica razon para cambiar.

**O - Open/Closed:** `SwapiClient` depende de `IHttpClient` (abstraccion), no de `fetch` directamente.
Para cambiar a Axios o agregar cache, solo implementas `IHttpClient` — sin tocar `SwapiClient`.

```typescript
// shared/http/IHttpClient.ts
export interface IHttpClient { get<T>(url: string): Promise<T>; }

// shared/http/FetchHttpClient.ts   <- implementacion actual
// shared/http/AxiosHttpClient.ts   <- futura alternativa
// shared/http/CachedHttpClient.ts  <- decorador con cache
```

**L - Liskov Substitution:** Cualquier `ICharacterRepository` es intercambiable:

```typescript
const repo: ICharacterRepository = new SwapiCharacterRepository(client);
// o en el futuro:
const repo: ICharacterRepository = new SupabaseCharacterRepository(db);
```

**I - Interface Segregation:** Interfaces pequenas y especificas por modulo:

```typescript
interface ICharacterRepository { findAll, findById, search }
interface IStarshipRepository  { findAll, findById }
```

**D - Dependency Inversion:** Los Casos de Uso dependen de interfaces, nunca de implementaciones:

```typescript
// BIEN: Application Layer depende de abstraccion
export class GetCharacters {
    constructor(private repo: ICharacterRepository) { }
}
// MAL: nunca importar implementaciones en application/
// import { SwapiCharacterRepository } from '../infrastructure/...'
// La unica clase que instancia implementaciones es config/dependencies.ts
```

---

## Estructura de Carpetas

```
src/
|
+-- modules/                         # Modulos de negocio (Screaming Architecture)
|   +-- characters/                  # Modulo Characters (autocontenido)
|       +-- domain/
|       |   +-- Character.ts         # Entidad de dominio
|       |   +-- ICharacterRepository.ts  # Contrato (interfaz)
|       +-- application/
|       |   +-- dtos/
|       |   |   +-- CharacterDTO.ts  # DTO + mapper toCharacterDTO()
|       |   +-- use-cases/
|       |       +-- GetCharacters.ts
|       |       +-- GetCharacterById.ts
|       +-- infrastructure/
|           +-- SwapiCharacterRepository.ts  # Implementa ICharacterRepository
|           +-- swapi/
|               +-- SwapiClient.ts   # Cliente HTTP para SWAPI
|               +-- types.ts         # Tipos de respuesta de SWAPI
|               +-- index.ts
|
+-- shared/                          # Codigo transversal (todos los modulos)
|   +-- http/
|       +-- IHttpClient.ts           # Interfaz + HttpError
|       +-- FetchHttpClient.ts       # Implementacion con fetch nativo
|
+-- config/
|   +-- dependencies.ts             # Composition Root (unico punto de instanciacion)
|
+-- pages/                           # Astro pages y API Routes
|   +-- index.astro
|   +-- api/characters/
|       +-- index.ts                # GET /api/characters
|       +-- [id].ts                 # GET /api/characters/:id
|
+-- presentation/                    # Componentes UI (Astro + React Islands)
|   +-- components/characters/
|   |   +-- CharacterCard.astro
|   |   +-- CharacterGrid.astro
|   +-- common/
|       +-- Hero.astro
|       +-- SectionContainer.astro
+-- layouts/
+-- lib/
+-- styles/
```

---

## Modulos de Dominio

### Regla de Oro: Modulos Aislados

Un modulo NO puede importar del `domain/` o `application/` de otro modulo directamente.

```
PERMITIDO:    modules/characters/application -> modules/characters/domain
NO PERMITIDO: modules/starships/application  -> modules/characters/domain
PERMITIDO:    modules/starships              -> shared/http  (codigo transversal)
PERMITIDO:    config/dependencies.ts         -> cualquier modulo (Composition Root)
```

### Estado de Modulos

| Modulo | Estado | Descripcion |
|---|---|---|
| `characters` | Implementado | Personajes del universo Star Wars |
| `starships` | Planificado | Naves espaciales |
| `planets` | Planificado | Planetas |
| `species` | Planificado | Especies |
| `films` | Planificado | Peliculas |

---

## Capas dentro de un Modulo

### Domain Layer (CORE)

Entidades y contratos del negocio. No depende de nada externo.

Reglas:
- NO importa de otras capas ni frameworks
- Solo logica de negocio pura
- Define interfaces que la infraestructura debe implementar

```typescript
// modules/characters/domain/Character.ts
export class Character {
    constructor(
        public readonly id: string,
        public readonly name: string,
        // ... resto de campos
    ) { }
    hasKnownHeight(): boolean { return this.height !== "unknown"; }
    isHuman(): boolean { return this.species.length === 0; }
}

// modules/characters/domain/ICharacterRepository.ts
export interface ICharacterRepository {
    findAll(page?: number): Promise<PaginatedResult<Character>>;
    findById(id: string): Promise<Character | null>;
    search(query: string): Promise<Character[]>;
}
```

### Application Layer (Casos de Uso)

Orquesta la logica. Coordina entre Domain e Infrastructure sin conocerla directamente.

Reglas:
- Solo importa del propio `domain/` del modulo
- Depende de interfaces, nunca implementaciones concretas
- Define y expone DTOs (nunca entidades crudas)
- NO importa de `infrastructure/`

```typescript
// modules/characters/application/use-cases/GetCharacters.ts
import type { ICharacterRepository } from '../../domain/ICharacterRepository';
import { toCharacterDTO } from '../dtos/CharacterDTO';

export class GetCharacters {
    constructor(private characterRepository: ICharacterRepository) { }
    async execute(page: number = 1): Promise<PaginatedCharactersDTO> {
        const result = await this.characterRepository.findAll(page);
        return {
            characters: result.data.map(toCharacterDTO),
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            hasNext: result.hasNext,
            hasPrevious: result.hasPrevious,
        };
    }
}
```

### Infrastructure Layer (Implementaciones)

Conecta el dominio con el mundo exterior (APIs, DB, archivos).

Reglas:
- Implementa interfaces del `domain/`
- Puede usar servicios de `shared/`
- NO es importada directamente por Application (solo via interfaces)

```typescript
// modules/characters/infrastructure/swapi/SwapiClient.ts
import type { IHttpClient } from '@/shared/http/IHttpClient';

export class SwapiClient {
    constructor(private httpClient: IHttpClient, private baseUrl = "https://swapi.dev/api") { }
    getPeople(page: number) {
        return this.httpClient.get(`${this.baseUrl}/people/?page=${page}`);
    }
}
```

---

## Flujo de Datos

```
Usuario (Browser)
    |
    v
Astro Page / API Route  (pages/)
    | importa del Composition Root
    v
config/dependencies.ts
    | ensambla e inyecta
    v
Use Case (GetCharacters)
    | llama via interfaz
    v
ICharacterRepository --> SwapiCharacterRepository
    |
    v
SwapiClient --> IHttpClient --> FetchHttpClient --> SWAPI REST API
                                                          |
                                                  Character Entity (domain)
                                                          |
                                                  CharacterDTO (application)
                                                          |
                                                  JSON Response -> UI
```

### Ejemplo: GET /api/characters

```typescript
// pages/api/characters/index.ts
import { getCharactersUseCase } from '@/config/dependencies';

export const GET: APIRoute = async ({ url }) => {
    const page = Number(url.searchParams.get("page") || "1");
    const result = await getCharactersUseCase.execute(page);
    return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" }
    });
};
```

La pagina nunca sabe que los datos vienen de SWAPI — eso es responsabilidad de infraestructura.

---

## Shared Layer

Codigo transversal que cualquier modulo puede usar.

```
shared/
+-- http/
    +-- IHttpClient.ts      # Interfaz + HttpError
    +-- FetchHttpClient.ts  # Implementacion con fetch nativo
```

Solo va en `shared/` si:
- Es usado por mas de un modulo
- No pertenece al dominio de ningun modulo especifico

Futuros candidatos:
- `shared/errors/` - AppError, NotFoundError
- `shared/cache/` - estrategia de cache en memoria

---

## Composition Root

Archivo: `src/config/dependencies.ts`

Unico lugar donde se instancian implementaciones concretas y se ensambla el grafo de dependencias.

```typescript
// config/dependencies.ts
import { FetchHttpClient } from '@/shared/http/FetchHttpClient';
import { SwapiClient } from '@/modules/characters/infrastructure/swapi';
import { SwapiCharacterRepository } from '@/modules/characters/infrastructure/SwapiCharacterRepository';
import { GetCharacters } from '@/modules/characters/application/use-cases/GetCharacters';
import { GetCharacterById } from '@/modules/characters/application/use-cases/GetCharacterById';

const httpClient = new FetchHttpClient();          // 1. HTTP Transport
const swapiClient = new SwapiClient(httpClient);  // 2. API Client
export const characterRepository = new SwapiCharacterRepository(swapiClient);
export const getCharactersUseCase = new GetCharacters(characterRepository);
export const getCharacterByIdUseCase = new GetCharacterById(characterRepository);
```

> Las paginas solo importan de `@/config/dependencies` — nunca de `infrastructure/` directamente.

---

## Guias de Implementacion

### Agregar un Nuevo Modulo (ejemplo: Starships)

**1. Domain:**
```typescript
// modules/starships/domain/Starship.ts
export class Starship { /* campos, metodos de negocio */ }

// modules/starships/domain/IStarshipRepository.ts
export interface IStarshipRepository {
    findAll(): Promise<Starship[]>;
    findById(id: string): Promise<Starship | null>;
}
```

**2. Application:**
```typescript
export interface StarshipDTO { id: string; name: string; model: string; }
export function toStarshipDTO(s: Starship): StarshipDTO { /* mapper */ }

export class GetStarships {
    constructor(private repo: IStarshipRepository) { }
    async execute(): Promise<StarshipDTO[]> { /* logica */ }
}
```

**3. Infrastructure:**
```typescript
export class SwapiStarshipRepository implements IStarshipRepository { /* ... */ }
```

**4. Composition Root** (agregar en `config/dependencies.ts`):
```typescript
import { GetStarships } from '@/modules/starships/application/use-cases/GetStarships';
const starshipRepository = new SwapiStarshipRepository(swapiClient);
export const getStarshipsUseCase = new GetStarships(starshipRepository);
```

**5. API Route:**
```typescript
// pages/api/starships/index.ts
import { getStarshipsUseCase } from '@/config/dependencies';
export const GET: APIRoute = async () => { /* ejecutar */ }
```

---

### Enriquecer con Datos Locales (JSON)

Para agregar descripciones, imagenes propias:

```
modules/characters/
+-- infrastructure/
    +-- data/
    |   +-- characters.json         <- datos propios
    +-- LocalCharacterDataSource.ts <- lee el JSON
    +-- SwapiCharacterRepository.ts <- fusiona ambas fuentes
```

La capa de domain ve `Character` con `description`. Nadie fuera de infrastructure
sabe que viene de un JSON local.

---

### Cambiar Fuente de Datos

Solo se modifica el Composition Root:

```typescript
// ANTES:
const characterRepository = new SwapiCharacterRepository(swapiClient);

// DESPUES:
const characterRepository = new SupabaseCharacterRepository(supabaseClient);

// El resto del sistema NO cambia!
```

---

## Convenciones y Best Practices

### Naming

| Tipo | Convencion | Ejemplo |
|---|---|---|
| Entidades | PascalCase | `Character.ts` |
| Interfaces | Prefijo `I` | `ICharacterRepository.ts` |
| DTOs | Sufijo `DTO` | `CharacterDTO.ts` |
| Casos de Uso | Verbo + Sustantivo | `GetCharacters.ts` |
| Repositorios | Proveedor + Tipo | `SwapiCharacterRepository.ts` |
| Carpetas multi-palabra | kebab-case | `use-cases/` |

### Imports - Usar Alias @/

```typescript
// BIEN - alias absoluto desde src/
import { GetCharacters } from '@/modules/characters/application/use-cases/GetCharacters'
import { FetchHttpClient } from '@/shared/http/FetchHttpClient'

// MAL - rutas relativas largas
import { GetCharacters } from '../../../../modules/characters/...'
```

---

## Testing

### Domain Layer - Tests Unitarios Puros

```typescript
describe("Character Entity", () => {
    it("should identify human character", () => {
        const ch = new Character("1","Luke","172","77",
            "blond","fair","blue","19BBY","male","url",[],[],[],[]);
        expect(ch.isHuman()).toBe(true);
    });
});
```

### Application Layer - Mock del Repositorio

```typescript
const mockRepo: ICharacterRepository = {
    findAll: jest.fn().mockResolvedValue({
        data: [], total: 82, page: 1, totalPages: 9,
        hasNext: true, hasPrevious: false
    }),
    findById: jest.fn(), search: jest.fn()
};
const result = await new GetCharacters(mockRepo).execute(1);
expect(result.total).toBe(82);
```

### Infrastructure Layer - Mock del HTTP Client

```typescript
const mockHttp: IHttpClient = {
    get: jest.fn().mockResolvedValue({ count: 82, results: [] })
};
const repo = new SwapiCharacterRepository(new SwapiClient(mockHttp));
```

### Ubicacion de Tests

```
modules/characters/
+-- domain/
|   +-- Character.ts
|   +-- Character.test.ts
+-- application/use-cases/
|   +-- GetCharacters.ts
|   +-- GetCharacters.test.ts
+-- infrastructure/
    +-- SwapiCharacterRepository.ts
    +-- SwapiCharacterRepository.test.ts
```

---

## Checklist de PR

- [ ] Codigo en el modulo y capa correctos
- [ ] Modulos no importan entre si directamente
- [ ] Dependencias fluyen: Domain <- Application (via interfaz) <- Infrastructure
- [ ] Nuevas instancias registradas en `config/dependencies.ts`
- [ ] Pages/API routes solo importan de `config/dependencies.ts`
- [ ] `npx tsc --noEmit` pasa sin errores

---

Que la Fuerza (y la arquitectura limpia) te acompanen!
