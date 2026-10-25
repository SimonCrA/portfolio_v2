# Resumen de entrega

- **Estado:** implementado localmente; release pendiente (PR); resultados en buscadores pendientes de observar.
- **Rama:** `seo/fundamentos` (sale de `fix/mobile`, PR #30).
- **Verificación local:** suite E2E completa en verde, `tests/e2e/seo.spec.ts` incluido; `validate_llms_txt.py` PASS; `pnpm typecheck` sin errores.

## Qué cambió

- Metadatos por página: título y descripción con el nombre, canonical, Open Graph (`article`/`profile`, `es_ES`, nombre del sitio) y tarjeta de X. Un solo `<h1>` por página.
- Datos estructurados: `WebSite`, `Person`, `ProfilePage`, `Blog`, `BlogPosting`, `CollectionPage`, `CreativeWork`.
- Rastreo: `robots.txt`, sitemap enlazado, 404 propia con `noindex`.
- Identidad: favicon SVG/ICO y `apple-touch-icon` con la cabeza del avatar.
- Markdown: `.md` por página, `/sitemap.md`, `/llms.txt`, con `Content-Type` y `Link` canónico en `vercel.json`.

## Estados separados

1. `implemented-locally`: sí.
2. `delivered-and-verified`: pendiente. Al mergear, verificar en producción: robots, íconos, cada `.md` (200, `text/markdown`, `Link` canónico) y el `<head>` de cada tipo de página.
3. `provider-outcome-pending`: indexación, aparición del favicon en Google y cualquier efecto en búsquedas o asistentes de IA. Tardan semanas y no están garantizados.

## Backlog priorizado

1. M1: verificar Search Console y enviar el sitemap (Simón).
2. A3: enlazar simonctech.com desde GitHub, LinkedIn y X (Simón).
3. A1: páginas por tema que reúnan posts y proyectos.
4. I1: dimensiones en las portadas de los posts.
5. P6: revisión editorial de los títulos de los posts.
6. Fecha de última modificación (`lastmod`) veraz en el sitemap XML.
