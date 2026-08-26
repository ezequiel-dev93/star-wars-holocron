---
title: Obtener personaje por ID
description: Consultá los datos completos de un personaje específico usando su ID numérico.
---

import { Badge } from '@astrojs/starlight/components';

## `GET /api/characters/[id]` <Badge text="GET" variant="success" />

Devuelve los datos de un personaje específico.

### URL

```
GET https://star-wars-holocron.vercel.app/api/characters/:id
```

### Path Params

| Parámetro | Tipo   | Descripción                      |
|-----------|--------|----------------------------------|
| `id`      | number | ID numérico del personaje (SWAPI) |

### Ejemplo de petición

```js
// Obtener a Luke Skywalker (ID: 1)
const res = await fetch('/api/characters/1');
const character = await res.json();

console.log(character.name);     // "Luke Skywalker"
console.log(character.imageUrl); // URL de la imagen
```

### Mostrar nombre e imagen en una card

```js
async function renderCharacterCard(id) {
  const res = await fetch(`/api/characters/${id}`);
  const char = await res.json();

  return `
    <div class="card">
      <img src="${char.imageUrl}" alt="${char.name}" />
      <h2>${char.name}</h2>
      <p>Altura: ${char.height} cm</p>
      <p>Nacimiento: ${char.birthYear}</p>
    </div>
  `;
}
```

### Respuesta exitosa — `200 OK`

```json
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
```

### Errores

| Código | Descripción                                   |
|--------|-----------------------------------------------|
| `400`  | El parámetro `id` no fue enviado              |
| `404`  | No se encontró un personaje con ese ID        |
| `500`  | Error interno del servidor                    |

### IDs de personajes populares

| ID | Personaje          |
|----|--------------------|
| 1  | Luke Skywalker     |
| 2  | C-3PO              |
| 3  | R2-D2              |
| 4  | Darth Vader        |
| 5  | Leia Organa        |
| 10 | Obi-Wan Kenobi     |
| 14 | Han Solo           |
| 20 | Yoda               |
