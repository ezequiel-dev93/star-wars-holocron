---
title: Planetas — Próximamente
description: El endpoint de planetas está en desarrollo.
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="En desarrollo">
  Este endpoint todavía no está disponible. Cuando esté listo vas a poder consultar todos los planetas del universo Star Wars.
</Aside>

## Lo que vendrá

```
GET /api/planets          → Listar todos los planetas (paginado)
GET /api/planets/:id      → Obtener planeta por ID
```

### Campos esperados

| Campo           | Descripción                        |
|-----------------|------------------------------------|
| `id`            | ID numérico del planeta            |
| `name`          | Nombre del planeta                 |
| `climate`       | Clima                              |
| `terrain`       | Tipo de terreno                    |
| `population`    | Población estimada                 |
| `diameter`      | Diámetro en km                     |
| `imageUrl`      | URL de imagen del planeta          |
