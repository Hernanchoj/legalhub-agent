# LegalHub – Agente de Marketing (GitHub Pages)

Interfaz para generar publicaciones creativas e imágenes llamativas, impulsada por un agente de marketing con más de 15 años de experiencia.

Sitio listo para publicar sin build. Incluye:
- React vía CDN (esm.run)
- Tailwind vía CDN
- Generación de texto por plantillas (funciona sin API)
- Opción de usar OpenAI si pegas tu API key (cliente, solo demo)
- Imágenes con Pollinations (sin clave)
- Exportables: CSV, ICS, PPTX y DOCX via ESM (pptxgenjs/docx)

## Cómo publicarlo en GitHub Pages
1. Crea un repo nuevo en GitHub, por ejemplo `legalhub-agent`.
2. Sube **index.html** y **app.js** (y este README si quieres).
3. Ve a **Settings → Pages**.
4. En "Build and deployment": selecciona **Deploy from a branch**.
5. Branch: `main`, Folder: **/** (root). Guarda.
6. Espera a que aparezca el link de Pages (algo como `https://tuusuario.github.io/legalhub-agent/`).
7. Abre el link: verás la app funcionando.

> Sin API key ya puedes generar contenido (modo plantillas) y usar imágenes (Pollinations).
> Si pegas una API key de OpenAI, se intentará generar con `gpt-4o-mini` desde el navegador.
