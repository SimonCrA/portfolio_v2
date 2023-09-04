---
title: 'ciclos en javascript (for, for...in, for...of, do...while)'
description: 'Manejo de ciclos para recorrer arreglos y objetos.'
publishDate: 'Sep 03 2023'
tags: ['javascript', 'arrays']
slug: 'javasctipt/loops'
image: '/posts/post3.webp'
---

# Introducción

Los ciclos son fragmentos de código que se repiten hasta que una condición de quiebre se cumpla y entonces el flujo del código sigue ejecutandose, tanto el inicio del bucle cómo la condición de quiebre pasando por lo que queremos iterar lo podemos controlar y/o asignar dependiendo de nuestras necesidades, es por esto que los ciclos o bucles nos permiten recorrer arreglos, obetos, y cadenas de carácteres. A continuación me enfocaré en responder a estas preguntas frecuentes al momento de tratar con bucles:

- Bucle for y ¿cómo puedo usarlo?
- Bucle for...in y ¿cómo puedo usarlo?
- Bucle for...of y ¿cómo puedo usarlo?
- Bucle do...while y ¿cómo puedo usarlo?

Al terminar de leer este post tendrás una idea más clara de lo que son los loops en javascript y cómo utilizarlo dependiendo del tipo de datos que tengas de entrada.

> Si eres de los que va directo al grano, te invito a que te saltes la explicación y vayas al final, que hay una tabla dónde puedes ver de manera resumida la respuesta a cada una de estas preguntas.

Imaginemos que tienes datos de usuarios guardados en un objeto, con estos conocimientos sabrás cuál es la manera más eficiente para buscar dentro de este objeto de usuarios, o si en cambio los datos están en un Arreglo sabrás cuál bucle es el más adecuado y así podrás elegir cuál te conviene más. Sin más rodeos empecemos ¡A programar!

## Bucle for y ¿cómo puedo usarlo?

Este buclese estructura de esta manera

```jsx
for (let i = 0; i < 10; i++) {
  //bloque a ejecutar
}
```

Si observamos con detenimiento veremos que hay tres secciones dentro de los parentesis separadas por dos ' ; '

**Primera sección:** Se ejecuta una sola vez antes de la ejecución del bloque interno del for

**Segunda sección:** Es la condición de ejecución del ciclo.

**Tercera sección:** Se ejecuta cada vez luego de que el bloque dentro del for es ejecutado

```jsx
for (let i = 0; i < 3; i++) {
  console.log(i)
}
//-->0
//-->1
//-->2
```

- La **primera** sección vemos que es utilizada para declarar la variable iteradora ya que esta se ejecuta una sola vez.
- La **segunda** sección define la condición que tiene el bucle para su ejecución, límite.

> 💡 Notas: La segunda sección puede ser omitida sino la necesitamos, en este caso debemos usar la opción **break** que romperá el ciclo cuándo se ejecute.

- La **tercera** sección cómo se ejecuta cada vez que el bloque termina de ejecutarse, incrementamos la variable que ya ha sido definida cómo iterador, de esta forma este iterador se aproximará cada vez más a la condición de quiebre que se establece en la segunda sección.

> 💡 Notas: La tercera sección puede incrementarse o decrementarse, inclusive cambiar de acuerdo a un patrón característico, también puede ser omitido en la declaración, mientras el iterador se incremente/decremente dentro del bloque de ejecución del bucle

## for...in y ¿Cómo puedo usarlo?

Este ciclo se estructura de esta manera.

```jsx
for (iterador in objeto) {
  //bloque a ejecutar
}
```

Este tipo de ciclo es una variación del primero y nos permite actuar sobre propiedades enumerables de un objeto veamos esto de una manera práctica en el siguiente ejemplo.

```jsx
let persona = { nombre: 'Maria', apellido: 'Sola', edad: 25 }
let propiedades = ''
let usuario = ''

for (i in persona) {
  propiedades += i + ' '
  usuario += persona[i] + ' '
}

console.log(propiedades) //-->nombre apellido edad
console.log(usuario) //-->Maria Sola 25
```

El iterador en este caso pasa a adquirir el valor del key de cada valor del objeto.

Si queremos imprimir los key del objeto pues imprimimos el la variable iteradora que en este caso es "i", pero si lo que nos interesa es el valor de la propiedad llamamos al objeto y lo ubicamos con el iterador (que será el key) en la posición exacta que queremos.

# for...of i ¿Cómo puedo usarlo?

El ciclo for...of va a través de los valores de un objeto que sea iterable incluyendo (Array, Map, Set...), la estructura es cómo sigue:

```jsx
for (iterador of objeto) {
  //Bloque a ejecutar
}
```

Cómo ya hemos visto este ciclo se parece mucho al for...in pero a diferencia de él, con este si que podemos iterar sobre arrays. Veamos un ejemplo prácitco de cómo podemos utilizarlo

La diferencia entre el for...of y el for...in son muy discretas, y a veces tienden a confundir pero para aclarar algunas dudas que tengamos hasta ahora veamos estos dos últimos ciclos en acción sobre la misma estructura de datos.

```jsx
const precios = [300, 200, 10]
precios.item = 'agotado'

for (precio in precios) {
  console.log(precio)
}
//-->0
//-->1
//-->2
//-->item

for (precio of precios) {
  console.log(precio)
}
//-->300
//-->200
//-->10
```

como vemos a la salida vamos obtener dos cosas totalmente distintas.

El for..in nos devuelve los key(índice) del array, mientras que el for..of nos devuelve sólo los valores iterables del array en este caso todos los que son números.

# do...while y ¿Cómo puedo usarlo?

Este bucle pose la siguiente estructura.

```jsx
do expresión
while (condicion)
```

> 💡 Notas: Si se quiere ejecutar más de una expresión deben usarse los "{}" entre el "do" y el "while".

- La sección **expresión** se ejecuta siempre una vez antes de que se verifique la validez de la condición
- La sección **condición** se ejecuta cada vez que la expresión se ejecute y verifica que sea `true` lo que hace que se ejecute de nuevo, si la condición es `false` el bucle se detiene y continúa el flujo del programa

Veamos a continuación un ejemplo prácito del funcionamiento de este bucle

```jsx
let cantCaramelos = 0
do {
  cantCaramelos++
  console.log(cantCaramelos)
} while (cantCaramelos < 5)
//-->1
//-->2
//-->3
//-->4
//-->5
```

En este ejemplo vemos cómo la variable `cantCaramelos` adquiere un valor de "5" al finalizar la iteración ya que la incrementamos cada vez que la condición no era falsa.

Una manera de ver su forma de aplicación sería pensar que si tienes:

- Un objeto la manera más eficiente de recorrerlo será haciendo uso del for...in
- Un objeto que puedes ser un array, o cualquier otro cómo un Map tu opción será el for...of.
- Cualquier otra estructura de datos que puedas ser iterable puedes optar por el bucle for.

Esto no significa que uno sea mejor que otro, no, están allí cómo herramientas, y nosotros usamos las herramientas cuándo las necesitamos ya que unas son más efectivas que otra haciendo una tarea específica. Mientras más específico sea el problema tendremos que usar herramientas más especificas. Déjale al for tradicional las tareas de propositos generales o dónde necesites controlar mejor los límites de iteración o patrones de iteración.
