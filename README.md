# @cart/contracts

Lo que la API y el frontend acuerdan: enumerados, constantes e interfaces de cada recurso. Sin lógica, sin dependencias.

- La API lo usa en sus schemas de Mongoose (enumerados), en sus DTOs (`implements` de los *Input*) y en sus mappers (devuelven las interfaces de respuesta).
- El frontend lo usa para tipar el cliente de la API y sus componentes.

Un cambio incompatible acá rompe el typecheck de ambos repos antes de llegar a producción.

```bash
pnpm install
pnpm build      # dist/ es lo que consumen los demás
```

Los otros repos lo referencian como `link:../contracts`, así que hay que compilarlo antes de levantarlos (`pnpm build` o `pnpm watch` mientras se edita).

Convenciones:
- Interfaces `Xxx` para respuestas, `XxxInput` para cuerpos de request, `XxxQuery` para query strings.
- Cuando el staff ve más que el comprador, la interfaz del staff **extiende** a la pública (`Order extends StorefrontOrder`).
- El dinero es un entero en la unidad mínima de la moneda (`Money`).
