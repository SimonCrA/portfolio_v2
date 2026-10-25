---
title: Workout Logger
summary: Una app para registrar mis entrenamientos en el gimnasio, eligiendo el músculo en un mapa del cuerpo.
kind: software
status: terminado
date: 2025-04-14
updated: 2025-04-24
tags: [web, astro, svelte]
stack: [Astro, Svelte, TypeScript, Tailwind CSS, Turso]
repo: https://github.com/SimonCrA/workout_logger
demo: https://workout-logger-sable.vercel.app
---

Quería una forma rápida de anotar lo que hago en el gimnasio sin pasar por menús ni formularios largos. En Workout Logger empiezas por el cuerpo: tocas el músculo que vas a entrenar y la app te muestra sus ejercicios.

## Cómo funciona

El mapa del cuerpo es un SVG con vista de frente y de espalda. Al elegir un músculo aparecen sus ejercicios, y cada entrenamiento que registras queda en tu historial.

## Cómo está hecho

Las páginas son de Astro y las partes interactivas, como el mapa y el registro, son islas de Svelte que comparten estado con nanostores. Los entrenamientos se guardan primero en el navegador, para que la app funcione aunque falle la conexión del gimnasio, y después se sincronizan con una base de datos Turso mediante Astro Actions.
