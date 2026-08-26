---
title: Armas — Próximamente
description: El endpoint de armas está en desarrollo.
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution" title="En desarrollo">
  Este endpoint todavía no está disponible. Cuando esté listo vas a poder consultar sables de luz, blasters y demás armas del universo Star Wars.
</Aside>

## Lo que vendrá

```
GET /api/weapons          → Listar todas las armas (paginado)
GET /api/weapons/:id      → Obtener arma por ID
```

### Campos esperados

| Campo       | Descripción                     |
|-------------|---------------------------------|
| `id`        | ID numérico                     |
| `name`      | Nombre del arma                 |
| `type`      | Tipo (sable de luz, blaster...) |
| `owner`     | Propietario conocido            |
| `imageUrl`  | URL de imagen                   |
