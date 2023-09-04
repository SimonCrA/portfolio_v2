---
title: 'Arreglos y sus métodos'
description: 'Estructura de datos; Arreglos como manipularlos efectivamente.'
publishDate: 'Sep 03 2023'
tags: ['javascript', 'arrays']
slug: 'javasctipt/arrays-methods'
image: '/posts/post1.webp'
---

# Introducción

Los arreglos son una estructura de datos homogeneos que se almacenan de forma consecutiva en la memoria RAM, son una herramienta que nos permite cómo programadores organizar los datos de algún sensor o usuarios para así poder manipularlos y utilizarlo para realizar otros cálculos u operaciones. Estos son el equivalente en matemáticas a vectores (Arreglos unidimensionales), matrices de dos dimensiones (Arreglos bidimensionales), matrices de mas de dos dimensiones (Arreglos con multiples dimensiones). Son tan importantes que se utilizan para todo y en todo, en este entrada me dispuse a responder a las siguientes preguntas frecuentes cuándo tratamos arreglos.

- ¿Cómo crear un arreglo?
- ¿Cómo acceder a una posición específica del arreglo?
- ¿cómo recorrer un arreglo?
- ¿Cómo agregar/eliminar elementos siempre al final del arreglo?
- ¿Cómo agregar/eliminar elementos siempre al inicio del arreglo?
- ¿cómo encontrar el índice de un elemento?
- ¿Eliminar uno y varios elementos a partir de una posición?

Conocer todos estos métodos te ayudará no sólo a programar más rápido sino que te sentirás más cómodo al momento de resolver un problema, ya que la mayoría de los datos que deberás tratar a lo largo de tus proyectos estará organizada en arreglos. Sin más rodeos empecemos ¡A programar!

> Si eres de los que va directo al grano, te invito a que te saltes la explicación y vayas al final, que hay una tabla dónde puedes ver de manera resumida la respuesta a cada una de estas preguntas.

> Yo haré la explicación usando Javascript pero en la mayoría de los lenguajes tienes las mismas opciones para trabajar con arreglos sólo debes buscar cómo es la sintaxis ya que esto es lo que cambia.

# ¿Cómo crear un arreglo?

```jsx
let frutas = []
let verduras = Array()
```

Así se crea un arreglo, puedes crearlo usando los corchetes cómo la primera opción o llamando directamente al constructor, cómo la segunda opción del ejemplo. Para ambas opciones se crea un arreglo vacío al que se le puede añadir cualquier tipo de datos en cualquier formato, pero siempre todos los datos deben ser del mismo tipo (int, string, float...)

# ¿Cómo acceder a una posición específica del arreglo?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
console.log(frutas[4]) //--> cambur
```

Es muy común que quieras acceder a un elemento específico de un arreglo que ya tienes creado, esto lo puedes hacer llamando al arreglo y le pasas el índice (posición) que tu elemento está ocupando en el arreglo. Es importante recordar que en los arreglos se toma en cuenta el cero cómo primera posición y para poder acceder al ítem "cambur" debes especificarle el índice 4 cómo el ejemplo demuestra.

# ¿Cómo recorrer un arreglo?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
//forma uno, manera optimizada
frutas.forEach(function (elemento, indice, array) {
  console.log(elemento, indice)
})
//forma dos, estándar.
for (let i = 0; i < frutas.length; i++) {
  console.log(`${frutas[i]} ${i}`)
}
//-->manzana 0
//-->pera 1
//-->guanabana 2
//-->lechoza 3
//-->cambur 4
```

Recorrer arreglos es tan común cómo crearlos y para hacerlo necesitas aprender de las herramientas que tienes a tu disposición, cómo pudiste ver en el ejemplo así de fácil es recorrer un arreglo, puedes hacer uso de esas dos técnicas, las estándar utilizando el ciclo `for` (los ciclos lo estudiaremos en el siguiente entrada), o la forma optimizada utilizando el método `forEach` que es parte de los métodos que empezaremos a ver desde ahora (y se explicará con más detalle en entradas posteriores).

# ¿Cómo agregar un elemento al final del arreglo

```jsx
let frutas = []
frutas.push('manzana')
frutas.push('pera')
frutas.push('guanabana')
frutas.push('lechoza')
frutas.push('cambur')
console.log(frutas)
//-->[ 'manzana', 'pera', 'guanabana', 'lechoza', 'cambur' ]
```

Es muy común también que debas añadir un elemento a un arreglo que ya has creado anteriormente, para hacerlo podemos hacer optar por el método `push()` el cuál se habilita al utilizar arreglos, este método nos permite añadir elementos siempre al final del arreglo.

# ¿Cómo eliminar un elementos al final del arreglo?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
frutas.pop()
frutas.pop()
console.log(frutas)
//-->[ 'manzana', 'pera', 'guanabana' ]
```

No sólo necesitarás añadir elementos al arreglo sino que eliminar elementos también es algo muy común, lo podrás hacer gracias al método `pop()`, y se utiliza llamando al arreglo y añadiendo un punto (esta es la manera en javascript de llamar métodos) y escribimos luego `pop()` (es importante añadir los paréntesis)

# ¿Cómo agregar elementos al inicio del arreglo?

```jsx
let frutas = ['lechoza', 'cambur']
frutas.unshift('guanabana')
frutas.unshift('pera')
frutas.unshift('manzana')
console.log(frutas)
//-->[ 'manzana', 'pera', 'guanabana', 'lechoza', 'cambur' ]
```

Vas a necesitar también añadir elementos al inicio. Imagina que tienes un lista de tareas por hacer y quieres que siempre la última que agregues sea la primera que veas, para hacer esto necesitas añadir los nuevos elementos al inicio del arreglo y lo lograrás llamando al método `unshift()`, cómo muestra el ejemplo de arriba.

# ¿Cómo quitar elementos al inicio del arreglo?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
frutas.shift()
frutas.shift()
frutas.shift()
console.log(frutas)
//-->['lechoza', 'cambur' ]
```

La operación inversa a agregar elementos al inicio es quitar/eliminar y puedes hacerlo con el método `shift()`.

# ¿Cómo encontrar el índice de un elemento en un arreglo?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
console.log(frutas.indexOf('guanabana'))
```

Tienes los datos de frutas cómo ves en el ejemplo y quieres reorganizar el arreglo colocando el que más te gusta de primero, supongamos que esa fruta es la guanabana, una manera de hacerlo es encontrando el índice de la fruta primero, usando el método `indexOf('nombre del elemento')` puedes encontrar el índice sólo sabiendo el nombre del elemento.

Para completar esta mini tarea, lo siguiente que deberías hacer es llamar al arreglo eliminando el elemento con el índice que obtuviste con el método `splice(indice,1)`, lo guardas en una variable y luego lo añades al inicio del arreglo con el método `unshift()`. Se explica mejor en los siguientes ejemplos.

# ¿Cómo eliminar un elemento de un arreglo según su posición?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
let elementoEliminado = frutas.splice(2, 1)
console.log(frutas)
console.log(elementoEliminado)
//-->[ 'manzana', 'pera', 'lechoza', 'cambur' ]
//-->['guanabana']
```

Vas a necesitar eliminar un elemento del arreglo que no está al inicio o al final del arreglo, sino en algún lugar dentro de este, para lograrlo también poseemos de un método llamado `splice(posicion del elemento,cantidad de elementos)`, si igualamos el resultado a un nuevo arreglo cómo en el ejemplo, vamos a obtener por el nuevo arreglo el objeto eliminado, pero si en cambio imprimimos el arreglo inicial veremos que nos devuelve el arreglo con todas las frutas pero sin el elemento que acabamos de eliminar.

# ¿Cómo eliminar varios elementos de un arreglo según su posición?

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
let elementoEliminado = frutas.splice(2, 2)
console.log(frutas)
console.log(elementoEliminado)
//-->[ 'manzana', 'pera', 'cambur' ]
//-->['guanabana', 'lechoza']
```

Por último cómo una pequeña variación del ejemplo anterior el método splice nos permite no sólo eliminar un elemento sino que podremos eliminar más de uno, `splice(posición del elemento, cantidad del elemento)`, si repasamos los parámetros que recibe el splice son:

- **Posición del elemento:** Esto especifica la posición desde dónde queremos empezar a eliminar elementos.
- **Cantidad de elementos:** Esto especifica cuántos quiero eliminar hacia la derecha del arreglo.

> Hay una variación de este método llamado slice(), y se comporta de manera similar al splice pero conserva al arreglo original sin modificación.

En este punto, ya sabemos las herramientas básicas con las que contamos a la hora de trabajar con arreglos en javascript, estas nos permitirán acceder a los datos, a borrarlos cual sea su posición, a recorrer nuestros datos, y eliminar mas de un dato en cualquier posición.

Espero que te haya sido muy útil esta información, a continuación dejaré una tabla que nos permitirá de una manera resumida repasar todo lo que aprendimos hoy.
