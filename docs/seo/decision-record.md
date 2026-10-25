# Registro de decisión: fundamentos de SEO

- **Responsable:** Simón Clemente.
- **Objetivo:** que simonctech.com se presente bien en buscadores y asistentes de IA para su nombre, su perfil, los temas de sus posts y sus proyectos.
- **Alcance:** todas las páginas públicas del sitio. Fuera de alcance: contenido editorial de los posts, enlaces externos y operaciones en Search Console.
- **Estado final esperado:** cada página con título, descripción, canonical, un `<h1>`, Open Graph y datos estructurados veraces; robots y sitemap enlazados; favicon con identidad propia; 404 propia; versión Markdown de cada página con `llms.txt` y `sitemap.md`.
- **Aceptación:** `tests/e2e/seo.spec.ts` y la suite completa en verde; `validate_llms_txt.py` PASS; `pnpm typecheck` sin errores; en la vista previa de Vercel, `robots.txt`, los íconos y cada `.md` responden 200 con el `Content-Type` y el `Link` canónico esperados.
- **Reversión:** revertir el PR. Ningún cambio toca contenido ni URLs existentes.
- **Autorizaciones:**
  - implementación local: sí (Simón eligió "Auditar y arreglar", 2026-10-25);
  - release (merge a `master`): pendiente de su aprobación en el PR;
  - operación en proveedor (Search Console, envío del sitemap): no autorizada; la hace Simón.
