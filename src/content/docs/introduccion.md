---
title: ¿Qué es Star Wars Holocron?
description: Una API REST gratuita y open-source para consumir datos del universo Star Wars.
---

import { Card, CardGrid } from '@astrojs/starlight/components';

**Star Wars Holocron** es una API REST que te permite acceder a datos del universo de Star Wars de forma simple y rápida.

Podés obtener información sobre personajes, planetas, películas y armas usando peticiones HTTP estándar.

## ¿Para qué sirve?

Podés usar esta API para:

- Mostrar fichas de personajes en tu app o sitio web
- Construir dashboards o estadísticas del universo Star Wars
- Aprender a consumir APIs REST con datos reales

## Recursos disponibles

<CardGrid>
  <Card title="Personajes" icon="person">
    Consultá todos los personajes o buscá uno por ID. Incluye nombre, imagen, altura, especie y más.
  </Card>
  <Card title="Planetas" icon="earth">
    Próximamente — datos de los planetas del universo Star Wars.
  </Card>
  <Card title="Películas" icon="star">
    Próximamente — catálogo completo de películas, series y directores.
  </Card>
  <Card title="Armas" icon="rocket">
    Próximamente — sables de luz, blasters y más.
  </Card>
</CardGrid>

## URL Base

```
https://star-wars-holocron.vercel.app/api
```

Todos los endpoints devuelven **JSON** y no requieren autenticación.
