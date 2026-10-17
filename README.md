# FOG

Mapa del mundo con los países visitados.

- **App:** https://laura2112-star.github.io/fog/ (versión principal).
- **Datos:** la lista de países se guarda en el Google Drive de quien inicia sesión, carpeta `FOG`, archivo `fog-datos.json` (en `data.mapa.visitados.codes`, códigos ISO numéricos). Aquí, en GitHub, solo está el código.
- **Origen:** copia del artefacto de Claude "FOG", con estos añadidos:
  - `fog-shim.js`: sustituye el almacenamiento de Claude (`window.claude.use("db")`, documento `mapa/visitados`) por Google Drive.
  - Tema de colores "Trópico" (bloque `<style id="fog-tropico">` y el degradado `fogGrad` al final de `index.html`).
  - Iconos y `manifest.webmanifest` para el móvil.

## Pestaña Ciudades

Las dos versiones tienen una pestaña **Ciudades**: desplegable por país con sus ciudades principales (`fog-ciudades.js`, datos de GeoNames con nombres en español para las más conocidas), puntos en el mapa al acercarse (se tocan para marcarlas) y buscador de cualquier ciudad (API de geocodificación de Open-Meteo). Se guardan en el documento `mapa/ciudades` (`{list: [{id, n, adm, cc, cn, lat, lon}], updatedAt}`); al añadir una ciudad se marca también su país.

## Versión sin cuenta (mapa.html)

https://laura2112-star.github.io/fog/mapa.html es la misma app sin Google: usa `fog-local.js`, que guarda los países en el propio móvil (localStorage) y añade los botones **Guardar copia** y **Cargar copia** (archivo JSON con el mismo formato que `fog-datos.json`). Tiene su propio `mapa.webmanifest`. Es la que usa el hijo de Laura.

## Cómo volver a crear el artefacto en otra cuenta de Claude

1. Toma `index.html` y quita la línea `<script src="fog-shim.js?v=1"></script>`. Sin ella, la página usa el almacenamiento de los artefactos (`db.doc("mapa/visitados")`).
2. Publícalo como artefacto con base de datos.
3. Copia la lista de `fog-datos.json` del Drive al documento `mapa/visitados` (`{codes: [...], updatedAt}`).

## Cuenta de Google

Proyecto `wanderlust-511911`, el mismo que Wanderlust e Italiano; la sesión de Google se comparte entre las tres apps.
