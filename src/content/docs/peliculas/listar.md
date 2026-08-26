---
title: Películas — Próximamente
description: El endpoint de películas está en desarrollo.
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="En desarrollo">
  Este endpoint todavía no está disponible. Cuando esté listo vas a poder consultar el catálogo completo de películas y series de Star Wars.
</Aside>

## Lo que vendrá

```
GET /api/movies           → Listar todas las películas (paginado)
GET /api/movies/:id       → Obtener película por ID
```

### Campos esperados

| Campo          | Descripción                         |
|----------------|-------------------------------------|
| `id`           | ID numérico                         |
| `title`        | Título de la película               |
| `episode`      | Número de episodio                  |
| `director`     | Director                            |
| `releaseDate`  | Fecha de estreno                    |
| `openingCrawl` | Texto de apertura                   |
| `imageUrl`     | URL del póster                      |
