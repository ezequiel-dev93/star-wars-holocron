---
title: Listar y filtrar personajes
description: Obtené una lista paginada o filtrada de los 364 personajes del universo Star Wars.
---

import { Badge } from '@astrojs/starlight/components';

## `GET /api/characters` <Badge text="GET" variant="success" />

Devuelve una lista paginada de personajes con soporte de búsqueda y filtros combinables.

### URL

```http
GET https://star-wars-holocron.vercel.app/api/characters
```

### Query Params

| Parámetro | Tipo    | Default | Descripción                                                       |
|-----------|---------|---------|-------------------------------------------------------------------|
| `page`    | number  | `1`     | Número de página                                                  |
| `limit`   | number  | `24`    | Cantidad de resultados por página (máx. `100`)                    |
| `q`       | string  | `""`    | Búsqueda por nombre, slug, planeta, especie, película o historia  |
| `species` | string  | `""`    | Filtrar por especie (ej. `Human`, `Droid`, `Togruta`)             |
| `planet`  | string  | `""`    | Filtrar por planeta natal (ej. `Tatooine`, `Naboo`, `Coruscant`)  |
| `gender`  | string  | `""`    | Filtrar por género (`male`, `female`, `unknown`)                  |
| `missing` | string  | `""`    | Enviar `1` para listar personajes sin retrato (ideal para colaborar) |

### Ejemplo de petición

```js
// Página 1 (por defecto)
const res = await fetch('/api/characters');
const data = await res.json();

// Filtrar personajes de Tatooine
const tatooine = await fetch('/api/characters?planet=Tatooine&limit=10').then(r => r.json());

// Buscar por nombre o película
const jedi = await fetch('/api/characters?q=skywalker').then(r => r.json());
```

### Respuesta exitosa — `200 OK`

```json
{
  "characters": [
    {
      "id": "1",
      "slug": "luke-skywalker",
      "name": "Luke Skywalker",
      "height": "172",
      "mass": "77",
      "hairColor": "blond",
      "skinColor": "unknown",
      "eyeColor": "blue",
      "birthYear": "19BBY",
      "gender": "male",
      "homeworldUrl": "Tatooine",
      "imageUrl": "/images/characters/luke-skywalker.jpeg",
      "species": ["Human"],
      "affiliations": [],
      "films": ["A New Hope", "The Empire Strikes Back", "Return of the Jedi"],
      "description": "Luke Skywalker was a Tatooine farmboy who rose from humble beginnings...",
      "avatarUrl": "/images/characters/luke-skywalker.jpeg",
      "isFavorite": false
    }
  ],
  "total": 364,
  "page": 1,
  "totalPages": 16,
  "hasNext": true,
  "hasPrevious": false
}
```

### Campos de cada personaje

| Campo          | Tipo       | Descripción                                      |
|----------------|------------|--------------------------------------------------|
| `id`           | string     | ID numérico del personaje (`"1"` a `"364"`)      |
| `slug`         | string     | Identificador amigable en URL (ej: `"luke-skywalker"`) |
| `name`         | string     | Nombre completo                                  |
| `height`       | string     | Altura en centímetros                            |
| `mass`         | string     | Peso en kilogramos                               |
| `hairColor`    | string     | Color de cabello                                 |
| `skinColor`    | string     | Color de piel                                    |
| `eyeColor`     | string     | Color de ojos                                    |
| `birthYear`    | string     | Año de nacimiento (ej: `19BBY`)                  |
| `gender`       | string     | Género (`male`, `female`, `unknown`)             |
| `homeworldUrl` | string     | Nombre del planeta natal                         |
| `imageUrl`     | string     | Ruta del retrato del personaje                   |
| `species`      | string[]   | Lista de especies a las que pertenece            |
| `affiliations` | string[]   | Organizaciones o facciones                       |
| `films`        | string[]   | Películas, series y obras en las que aparece     |
| `description`  | string?    | Historia y biografía del personaje               |
| `avatarUrl`    | string?    | Ruta del avatar en alta definición               |
| `isFavorite`   | boolean    | Indicador de favorito                            |

### Errores

| Código | Descripción                    |
|--------|--------------------------------|
| `500`  | Error interno del servidor     |
