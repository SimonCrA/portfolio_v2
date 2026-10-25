# Hallazgos de la auditoría

Estado: completado (implementación local en la rama `seo/fundamentos`). Evidencia capturada el 2026-10-25T23:34Z contra https://www.simonctech.com (producción, commit 13afaa4) y el build local.

Clasificación: **defecto confirmado** (se arregla), **oportunidad** (se arregla si es barata y verificable), **backlog** (queda anotado), **bloqueado** (falta un dato o un acceso).

## Técnico

| # | Observado | Clase | Acción en esta rama |
| --- | --- | --- | --- |
| T1 | `/robots.txt` → 404 | Defecto | `public/robots.txt` con `Allow: /`, `Disallow: /api/` y `Sitemap:` |
| T2 | Ninguna página tiene `<link rel="canonical">`; `/blog` y `/blog/` responden 200 | Defecto | Canonical por página con el host `www` y la barra final |
| T3 | El sitemap XML existe pero ni robots ni el `<head>` lo enlazan | Defecto | `Sitemap:` en robots y `<link rel="sitemap">` |
| T4 | Favicon = emoji 😎 de 48×48; no hay `apple-touch-icon` (404) | Defecto (identidad) | `favicon.svg`, `favicon.ico` 48×48 y `apple-touch-icon.png` 180×180 a partir del avatar |
| T5 | URLs no encontradas devuelven el 404 de texto plano de Vercel | Oportunidad | `404.astro` con estilo de terminal, `noindex` y enlaces a cada ventana |
| T6 | URLs viejas | Sin defecto | El blog viejo paginaba de a 10 y había 5 posts: `/blog/2` nunca existió. Todas las rutas viejas siguen vivas, no hacen falta redirects |
| T7 | `simonctech.com` y `http://` → 308 a `https://www.simonctech.com/` | Correcto | Ninguna |

## Página y contenido

| # | Observado | Clase | Acción |
| --- | --- | --- | --- |
| P1 | Título del inicio "Simonctech \| portafolio personal": no incluye el nombre | Defecto | "Simón Clemente \| Ingeniero de software fullstack" |
| P2 | Descripción genérica repetida en inicio y Sobre mí | Defecto | Una descripción propia por página, con el nombre y el tema |
| P3 | Títulos "Blog \| Simonctech", "BikerHub \| Proyectos": no nombran al autor | Oportunidad | "… \| Simón Clemente" en todas |
| P4 | `/blog`, `/projects` y `/videos` no tienen `<h1>` | Defecto | El título del pane pasa a ser `<h1>` (sin cambio visual) |
| P5 | Los Posts tienen dos `<h1>` (el título y "# Introducción" del Markdown) | Defecto | Plugin rehype: si el cuerpo usa `#`, todos sus títulos bajan un nivel |
| P6 | Títulos de posts con detalles editoriales ("imagenes" sin tilde, "github" en minúscula, slug `javasctipt`) | Backlog | Decisión editorial de Simón. Cambiar el slug rompería enlaces existentes; no se toca |

## Datos estructurados

| # | Observado | Clase | Acción |
| --- | --- | --- | --- |
| S1 | Ningún JSON-LD en el sitio | Oportunidad | `WebSite`, `Person` (Sobre mí, `ProfilePage`), `Blog` + `BlogPosting`, `CollectionPage` + `CreativeWork` por proyecto |
| S2 | Hechos de la entidad | Verificado | Nombre, cargo, Nueve Once y enlaces salen de `sobre-mi.md`, que es lo visible. No se agregan reseñas, ratings ni FAQ inventadas |

Los datos estructurados no garantizan resultados enriquecidos ni citas en buscadores de IA.

## Redes sociales

| # | Observado | Clase | Acción |
| --- | --- | --- | --- |
| O1 | `og:type` siempre `website`; faltan `og:site_name`, `og:locale` y tarjeta de X | Oportunidad | `article` en Posts y Proyectos, `profile` en Sobre mí, `es_ES`, `twitter:card` y `twitter:creator` |

## Markdown y llms.txt (perfil de descubrimiento)

| # | Acción |
| --- | --- |
| M0 | Versión `.md` de cada página canónica (inicio, Sobre mí, blog, proyectos, videos, cada Post y cada Proyecto), generada en el build desde el mismo contenido. Cada una nombra su página HTML canónica |
| M0b | `/sitemap.md` (mapa de páginas y sus `.md`) y `/llms.txt` (guía para modelos de lenguaje, validada con el validador de la suite) |
| M0c | `vercel.json`: `Content-Type: text/markdown; charset=utf-8` y `Link: <html>; rel="canonical"` para cada `.md` |
| M0d | Comentarios en `robots.txt` que apuntan a `llms.txt` y `sitemap.md`. El sitemap XML no se toca: lo genera `@astrojs/sitemap` y no permite comentarios sin un postproceso |

Estos archivos son una guía para quien quiera leerlos. No son una regla para crawlers ni garantizan que un buscador de IA los use.

## Imágenes

| # | Observado | Clase |
| --- | --- | --- |
| I1 | Las portadas de los posts no declaran `width`/`height` (posible salto de layout) | Backlog |
| I2 | Las portadas llevan `alt=""`; el texto de la imagen repite el título del post | Correcto (decorativas) |

## Arquitectura y autoridad

| # | Observado | Clase |
| --- | --- | --- |
| A1 | Los tags solo existen como filtros `?q=`; no hay páginas por tema que reúnan posts y proyectos | Backlog (oportunidad de páginas de tema) |
| A2 | Los posts no enlazan a posts o proyectos relacionados | Backlog |
| A3 | Enlaces externos hacia el sitio (GitHub, LinkedIn, X) | Bloqueado: sin datos de backlinks. Recomendación: poner simonctech.com en esos perfiles |

## Medición

| # | Observado | Clase |
| --- | --- | --- |
| M1 | No hay acceso a Google Search Console ni Bing Webmaster Tools | Bloqueado. Simón verifica la propiedad y envía `https://www.simonctech.com/sitemap-index.xml` (operación en el proveedor, fuera de esta rama) |
