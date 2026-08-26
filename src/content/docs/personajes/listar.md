---
title: Listar personajes
description: Obtené una lista paginada de todos los personajes del universo Star Wars.
---

import { Badge } from '@astrojs/starlight/components';

## `GET /api/characters` <Badge text="GET" variant="success" />

Devuelve una lista paginada de personajes.

### URL

```
GET https://star-wars-holocron.vercel.app/api/characters
```

### Query Params

| Parámetro | Tipo   | Default | Descripción              |
|-----------|--------|---------|--------------------------|
| `page`    | number | `1`     | Número de página         |

### Ejemplo de petición

```js
// Página 1 (por defecto)
const res = await fetch('/api/characters');
const data = await res.json();

// Página 2
const res2 = await fetch('/api/characters?page=2');
```

### Respuesta exitosa — `200 OK`

```json
{
  "characters": [
    {
      "id": "1",
      "name": "Luke Skywalker",
      "height": "172",
      "mass": "77",
      "hairColor": "blond",
      "skinColor": "fair",
      "eyeColor": "blue",
      "birthYear": "19BBY",
      "gender": "male",
      "homeworldUrl": "https://swapi.dev/api/planets/1/",
      "imageUrl": "https://starwars-visualguide.com/assets/img/characters/1.jpg",
      "description": null,
      "avatarUrl": null,
      "isFavorite": false
    }
  ],
  "total": 82,
  "page": 1,
  "totalPages": 9,
  "hasNext": true,
  "hasPrevious": false
}
```

### Campos de cada personaje

| Campo          | Tipo    | Descripción                                      |
|----------------|---------|--------------------------------------------------|
| `id`           | string  | ID numérico del personaje (de SWAPI)             |
| `name`         | string  | Nombre completo                                  |
| `height`       | string  | Altura en centímetros                            |
| `mass`         | string  | Peso en kilogramos                               |
| `hairColor`    | string  | Color de cabello                                 |
| `skinColor`    | string  | Color de piel                                    |
| `eyeColor`     | string  | Color de ojos                                    |
| `birthYear`    | string  | Año de nacimiento (ej: `19BBY`)                  |
| `gender`       | string  | Género (`male`, `female`, `n/a`, etc.)           |
| `homeworldUrl` | string  | URL del planeta natal (recurso SWAPI)            |
| `imageUrl`     | string  | URL de la imagen del personaje                   |
| `description`  | string? | Descripción personalizada (puede ser `null`)     |
| `avatarUrl`    | string? | Avatar personalizado (puede ser `null`)          |
| `isFavorite`   | boolean | Si está marcado como favorito                    |

### Errores

| Código | Descripción                    |
|--------|--------------------------------|
| `500`  | Error interno del servidor     |
