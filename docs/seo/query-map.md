# Mapa de búsquedas y páginas responsables

Estado: provisional (sin datos de demanda). Fecha: 2026-10-25. Responsable: Simón Clemente.

Las búsquedas objetivo las eligió Simón: su nombre, su perfil profesional, los temas de sus posts y sus proyectos. No hay acceso a Search Console ni a una herramienta de volumen de búsqueda, así que **los volúmenes son desconocidos**; las familias y su dificultad relativa son inferencias, no mediciones.

## Familias de búsqueda → una página responsable

| Familia | Ejemplos | Página HTML | Markdown | Pista |
| --- | --- | --- | --- | --- |
| Nombre (navegacional) | "Simón Clemente", "simonctech" | `/` | `/index.md` | Cercana |
| Nombre + perfil | "Simón Clemente desarrollador", "Simón Clemente Nueve Once" | `/sobre-mi/` | `/sobre-mi.md` | Cercana |
| Perfil profesional | "ingeniero de software fullstack Venezuela", "desarrollador fullstack Venezuela" | `/` y `/sobre-mi/` | ambos | Liderazgo (difícil) |
| CV con LaTeX | "crear cv con latex", "cv latex github actions" | `/blog/cv/github-latex/` | `.md` | Cercana (cola larga) |
| Ciclos JavaScript | "ciclos en javascript", "for in vs for of" | `/blog/javasctipt/loops/` | `.md` | Cercana |
| Arreglos JavaScript | "métodos de arreglos javascript" | `/blog/javasctipt/arrays-methods/` y `…-intermediate/` | `.md` | Cercana; riesgo de canibalización entre los dos posts |
| Imágenes webp | "convertir imágenes a webp", "optimizar imágenes web" | `/blog/optimizar/imagenes-web/` | `.md` | Cercana |
| Proyectos | "BikerHub", "Vigía load testing Go", "Workout Logger Astro" | `/projects/<slug>/` | `.md` | Cercana para nombres únicos; "Vigía" es ambiguo |

## Dos pistas

- **Cercana:** el nombre propio y la cola larga de los posts y proyectos. Dependen sobre todo de que cada página tenga título, descripción, canonical y datos estructurados claros, que es lo que implementa esta ronda.
- **Liderazgo:** "desarrollador / ingeniero fullstack Venezuela" es una búsqueda de alta competencia. Sigue siendo un objetivo, pero necesita autoridad (enlaces desde GitHub, LinkedIn, X y otros sitios) y más contenido sobre el tema; no se resuelve con metadatos.

## Desambiguación del nombre

"Simón Clemente" no es un nombre único. La entidad `Person` (Schema.org) con `sameAs` a GitHub, LinkedIn, X y Linktree, la misma bio en todas partes y el favicon con el avatar ayudan a que los buscadores asocien esta persona con este sitio. Que lo hagan no está garantizado.

## Siguiente responsable

- Simón: verificar el sitio en Google Search Console para tener datos reales de consultas (ver `audit-findings.md`, M1).
