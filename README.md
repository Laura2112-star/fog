# FOG

Mapa del mundo con los países visitados.

- **App:** https://laura2112-star.github.io/fog/ (versión principal).
- **Datos:** la lista de países se guarda en el Google Drive de quien inicia sesión, carpeta `FOG`, archivo `fog-datos.json` (en `data.mapa.visitados.codes`, códigos ISO numéricos). Aquí, en GitHub, solo está el código.
- **Origen:** copia del artefacto de Claude "FOG", con estos añadidos:
  - `fog-shim.js`: sustituye el almacenamiento de Claude (`window.claude.use("db")`, documento `mapa/visitados`) por Google Drive.
  - Tema de colores "Trópico" (bloque `<style id="fog-tropico">` y el degradado `fogGrad` al final de `index.html`).
  - Iconos y `manifest.webmanifest` para el móvil.

## Cómo volver a crear el artefacto en otra cuenta de Claude

1. Toma `index.html` y quita la línea `<script src="fog-shim.js?v=1"></script>`. Sin ella, la página usa el almacenamiento de los artefactos (`db.doc("mapa/visitados")`).
2. Publícalo como artefacto con base de datos.
3. Copia la lista de `fog-datos.json` del Drive al documento `mapa/visitados` (`{codes: [...], updatedAt}`).

## Cuenta de Google

Proyecto `wanderlust-511911`, el mismo que Wanderlust e Italiano; la sesión de Google se comparte entre las tres apps.
