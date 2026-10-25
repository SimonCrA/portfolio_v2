---
title: Vigía
summary: Una CLI en Go que hace pruebas de carga a una API y verifica sus respuestas al mismo tiempo.
kind: software
status: activo
date: 2026-02-28
tags: [go, cli, testing]
stack: [Go, YAML]
---

Las herramientas de pruebas de carga te dicen qué tan rápido responde un servicio, pero no si lo que responde es correcto. Vigía hace las dos cosas en la misma corrida: genera carga y revisa cada respuesta.

## Cómo funciona

Cada prueba es un plan en YAML: el endpoint, los headers, la concurrencia, la duración y, si quieres, un ritmo fijo de peticiones por segundo. También define qué debe cumplir cada respuesta y cuántos errores se toleran.

```yaml
name: "smoke-users-api"
target:
  base_url: "https://api.example.com"
request:
  method: "GET"
  path: "/health"
load:
  concurrency: 1
  duration: "5s"
  rps: 5
assertions:
  status: 200
  headers:
    Content-Type: "application/json"
thresholds:
  max_error_rate: 0.05
```

Un pool de workers envía las peticiones con un solo `http.Client` compartido, y cada respuesta pasa por las aserciones de código de estado, headers y valores dentro del JSON. Al terminar, Vigía imprime en la terminal las latencias p50, p90, p95 y p99, las peticiones por segundo que logró y los errores separados por tipo: red, timeout o aserción.

Si la prueba supera los umbrales, el programa sale con un código distinto de cero. Así puede correr dentro de un pipeline de CI y frenar un despliegue.
