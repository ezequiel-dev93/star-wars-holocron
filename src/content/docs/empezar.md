---
title: Empezar rápido
description: Cómo hacer tu primera petición a la API de Star Wars Holocron en minutos.
---

La API de Holocron no requiere autenticación. Solo necesitás hacer un `fetch` a la URL correcta.

## Tu primera petición

```js
const response = await fetch('https://star-wars-holocron.vercel.app/api/characters');
const data = await response.json();

console.log(data.characters); // Array de personajes
```

## Ejemplo completo

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="characters"></ul>

    <script>
      fetch('https://star-wars-holocron.vercel.app/api/characters')
        .then(res => res.json())
        .then(data => {
          const list = document.getElementById('characters');
          data.characters.forEach(char => {
            const li = document.createElement('li');
            li.textContent = char.name;
            list.appendChild(li);
          });
        });
    </script>
  </body>
</html>
```

## Formato de respuesta

Todas las respuestas son **JSON** con `Content-Type: application/json`.

Los errores devuelven un objeto con la clave `error`:

```json
{ "error": "Character not found" }
```

## Límites

Por el momento no hay rate limiting. La API es de uso libre.
