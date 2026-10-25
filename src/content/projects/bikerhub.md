---
title: BikerHub
summary: Un hub para motorizados en Venezuela, para comparar motos y encontrar repuestos compatibles.
kind: software
status: activo
date: 2026-05-19
updated: 2026-05-27
tags: [web, nextjs]
stack: [Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma, Supabase]
demo: https://bikerhub-ten.vercel.app
featured: true
---

Comprar una moto en Venezuela significa saltar entre grupos de WhatsApp, Marketplace y foros para comparar modelos. Después, encontrar un repuesto que le sirva a tu moto es otra búsqueda igual de larga. BikerHub junta las dos cosas en un solo lugar.

## Qué hace

Tiene dos módulos:

- **BikeMatch.** Un catálogo de motos que puedes filtrar por tipo, cilindrada y precio, y comparar lado a lado.
- **MotoRepuestos.** Un catálogo de repuestos donde cada pieza dice con qué modelos es compatible.

## Cómo está hecho

Es una app de Next.js con el App Router y TypeScript estricto. Los datos de las motos y los repuestos viven en PostgreSQL sobre Supabase, con Prisma como ORM y un seed que carga el catálogo inicial. La interfaz usa Tailwind y shadcn/ui, y la lista de motos que estás comparando se guarda en el navegador, así que sobrevive a una recarga.
