---
title: Obtener personaje por ID o Slug
description: Consultá los datos completos de un personaje usando su ID numérico o su slug.
---

import { Badge } from '@astrojs/starlight/components';

## `GET /api/characters/[id]` <Badge text="GET" variant="success" />

Devuelve la ficha completa de un personaje específico buscando por su **ID numérico**, su **slug** o su **nombre**.

### URL

```http
GET https://holocron.ezequielsuarez-dev.com/api/characters/:id
```

### Path Params

| Parámetro | Tipo   | Descripción                                                      |
|-----------|--------|------------------------------------------------------------------|
| `id`      | string | ID numérico (`1`), slug (`luke-skywalker`) o nombre del personaje |

### Ejemplo de petición

```js
// Por ID numérico
const res = await fetch('/api/characters/1');
const character = await res.json();

// O por slug
const ahsoka = await fetch('/api/characters/ahsoka-tano').then(r => r.json());

console.log(ahsoka.name);     // "Ahsoka Tano"
console.log(ahsoka.imageUrl); // "/images/characters/ahsoka-tano.jpeg"
```

### Respuesta exitosa — `200 OK`

```json
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
  "films": [
    "A New Hope",
    "The Empire Strikes Back",
    "Return of the Jedi"
  ],
  "description": "Luke Skywalker was a Tatooine farmboy who rose from humble beginnings...",
  "avatarUrl": "/images/characters/luke-skywalker.jpeg",
  "isFavorite": false
}
```

### Errores

| Código | Descripción                                   |
|--------|-----------------------------------------------|
| `400`  | El parámetro `id` no fue enviado              |
| `404`  | No se encontró un personaje con ese ID o slug |
| `500`  | Error interno del servidor                    |

### Personajes populares para probar

| ID   | Slug               | Personaje          |
|------|--------------------|--------------------|
| `1`  | `luke-skywalker`   | Luke Skywalker     |
| `2`  | `c-3po`            | C-3PO              |
| `3`  | `r2-d2`            | R2-D2              |
| `4`  | `darth-vader`      | Darth Vader        |
| `5`  | `leia-organa`      | Leia Organa        |
| `10` | `obi-wan-kenobi`   | Obi-Wan Kenobi     |
| `13` | `han-solo`         | Han Solo           |
| `19` | `yoda`             | Yoda               |
| `45` | `ahsoka-tano`      | Ahsoka Tano        |
