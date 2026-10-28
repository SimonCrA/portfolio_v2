---
title: 'Arreglos y sus métodos (intermedio)'
description: 'Más métodos de los arreglos: forEach, map, find, some, every, sort, reduce y filter.'
publishDate: 'Sep 03 2023'
tags: ['javascript']
series: { name: 'Arreglos en JavaScript', part: 2 }
slug: 'javasctipt/arrays-methods-intermediate'
image: '/posts/post2.webp'
---

# Introducción

Cuándo trabajamos con arreglos ya hemos visto que podemos manipularlos con métodos de instancia que vienen consigo, podemos:

- Añadir/eliminar elementos al final del arreglo
- Añadir/eliminar elementos al inicio del arreglo
- Añadir/eliminar elementos en otra posición dentro del arreglo
- Recorrer un arreglo

> 💡 **Nota:** Sino sabes aún cómo hacer esto, o te gustaría repasarlo te invito a leer la primera parte de esta serie dónde repasamos todos estos conceptos básicos al tratar con arreglos. Ve directo con este enlace

Los arreglos son estructuras de datos versátiles dónde podemos almacenar y organizar nuestros datos de manera secuencial en la memoria RAM, nuestros datos a su vez pueden venir de un sensor que está tomando muestras cada minuto por un mes, o de usuarios de una plataforma que va creciendo exponencialmente y se agregan miles de usuarios por mes, esta situacion nos lleva a buscar maneras eficientes al momento de tratar arreglos de mucha datos.

A continuación estableceré varios casos que nos demandan un método eficiente a la hora de obtener o realizar lo que queremos.

- buscar en un arreglo desconocido (no sabemos todos los datos que trae) si un valor cumple con un condición establecida. (.find)
- Cambiar cómo son los datos dentro de un arreglo, si antes eran string y ahora numericos. (.map)
- Invertir el orden del arreglo. (.reverse)
- Puede que nos interese saber cuándo al menos un elemento posee una caracteristica que le pasemos cómo argumento (.some)
- También nos interesará saber cuándo todos los elementos del arreglo cumplen con una característica (.every)
- Ordenar un arreglo (.sort)
- Filtrar elementos que cumplan con una característca específica (.filter)
- Aplicar cálculos matemáticos o estadísticos a un arreglo (suma, multiplicación, promedio, media) (.reduce)
- Recorrer un arreglo (.forEach)

Todas estas situaciones las podemos resolver utilizando métodos de instancia de los arreglos, los métodos de instancia en su mayoría reciben una función dónde se le establece las condiciónes para manipular el arreglo. Vamos ahora a lo que nos gusta ¿cómo lo puedo hacer con código? ¡A programar!

**_Todos los métodos que vamos a ver poseen la misma estructura sintática_**, de modo que explicaremos con detenimiento cada parámetro y argumento necesario a continuación para que entiendas cómo construir la función que reciben cada uno de estos métodos y luego podrás aplicarlo a cada uno

```jsx
array.metodo(function callback(valorActual, indice, arreglo) {
  //iterador, acción que se ejecuta en cada iteración
}, thisValue)
```

Estudiemos más profundo cada parámetro.

Cómo vemos cada método (forEach(), map(), find()...) recibe cómo parámetro una función la cuál es necesaria para ser ejecutada cada vez por elemento que contenga el arreglo.

1. Callback
   - **valorActual:** El elemento actual en dónde se encuentra el iterador en el arreglo.
   - **indice:** El índice actual que tiene el elemento del arreglo.
   - **arreglo:** El arreglo al que el forEach se aplica, el nombre del arreglo se agrega aquí.
2. thisValue

   Es un valor pasado a la función para así ser usado cómo el valor `this`

Notarás que durante los ejemplos que veremos habrá una diferencia en cuánto a cómo se escribe la función en comparación a la descrita aquí arriba sintácticamente, ya que estoy utilizando la sintáxis **ES6 (ECMAScript6)** que mejora entre otras cosas la forma en cómo se escriben las funciónes utilizando funciones de flecha y destructuración.

> 💡 **Nota:** ECMAScript es la asociacón encargada de mantener el lenguaje de programación Javascript, y desde el 2016 decidieron actualizar el lenguaje con nuevas caracteristicas cada año, siendo el 2015 la actualización más importante de todas. En esta entrada utilizaremos la versión del 2015 (ES6)

## forEach()

El método `forEach()` nos permitirá recorrer el arreglo, este método ejecuta la función que se la pasa por argumento por cada elemento del arreglo.

Con el forEach() obtendrás el mismo resultado cómo si estuvieras recorriendo un arreglo con los métodos ya vistos cómo for...in, for..of, for (ver entrada anterior aquí). La diferencia del forEach es que acepta una función cómo callback y esta función se ejecuta por cada elemento del arreglo

Todas estos parámetros que posee el callback son opcionales. Veamos el `forEach()` en acción en un ejemplo sencillo.

```jsx
const arrNum = [1, 2, 3, 4, 5]

//ES5
arrNum.forEach(function (elemento) {
  console.log(elemento)
})

//-->1
//-->2
//-->3
//-->4
//-->5

//ES6
arrNum.forEach((elemento) => console.log(elemento))

//-->1
//-->2
//-->3
//-->4
//-->5

//Otra manera de ver cómo podrías utilizar el forEach() llamando a la funcion
//y pasandole el elemento

let acum = 0
arrNum.forEach(miFuncion)

function miFuncion(elemento) {
  acum += elemento
}
console.log(acum)
//-->15
```

Cómo vemos en el ejemplo el callback llamado "elemento" adquiere en cada iteración el valor del elemento del arreglo. Pero que pasa si nos interesa también el indice del elemento. Veamos el siguiente ejemplo el cuál lo ilustra.

```jsx
let arrNum = [2, 4, 6, 8, 10]
arrNum.forEach(function (valor, indice, array) {
  console.log('En el índice ' + indice + ' hay este valor: ' + valor)
  console.log(array)
})
//-->"En el índice 0 hay este valor: 2"
//-->[2, 4, 6, 8, 10]
//-->"En el índice 1 hay este valor: 4"
//-->[2, 4, 6, 8, 10]
//-->"En el índice 2 hay este valor: 6"
//-->[2, 4, 6, 8, 10]
//-->"En el índice 3 hay este valor: 8"
//-->[2, 4, 6, 8, 10]
//-->"En el índice 4 hay este valor: 10"
//-->[2, 4, 6, 8, 10]
```

Como vimos en el ejemplo a la función le estamos pasando todos los parámetros y además los estamos imprimiendo en consola para obtener el valor de cada parámetro por iteración.

## map()

El método `map()` genera un nuevo arreglo en dónde serán guardados los resultados de la operación ejecutada en la función que sele pasa cómo argumento.

Entendamos este método cómo un mutador, es una herramienta que nos permite mutar los elementos de un arreglo de una manera sencilla, cómo vemos arriba recibe una función y esta se ejecutará por cada elemento que haya en el arreglo, lo que nos da una versatilidad interesante, ya que dentro de esa función podríamos desde convertir el tipo de datos, hasta realizar operaciones matemáticas completas por cada elemento. Veamos un ejemplo de los que les comento:

### Dar nuevo formato

En esta ocasión vamos a convertir una cadena de textos a números. Esto es un ejemplo de lo que podrías hacer si obtienes datos de un sensor que fueron formateados en el dormato csv (separados por coma).

```jsx
let numeros = '1,2,3,4,5'
let arrNumeros = numeros.split(',')
let numerosAEnteros = arrNumeros.map((elemento) => parseInt(elemento))
console.log(arrNumeros)
console.log(numerosAEnteros)
//-->["1", "2", "3", "4", "5"]
//-->[1, 2, 3, 4, 5]
```

Utilizamos el método `split()` el cuál esta disponible al utilizar strings, y nos permite separar la cadena de string por delimitadores, que en este caso le específicamos que fuera la coma (','), para los que no lo saben aún ,este método nos devuelve un arreglo (el resultado del primer log) dónde cada elemento es cada caracter separado. El paso siguente sería convertir los numeros (qué apesar de ser números están formateados cómo string) a enteros con el método `parseInt()` (el resultado del segundo log). Y así tenemos nuestros número en el formato adecuado para operar sobre ellos, dale un vistazo a lo que sigue.

### Operaciones matemáticas.

En este ejemplo vamos a convertir el arreglo de números que obtuvimos en el ejemplo pasado para que cada elemento sea la potencia de dos del número.

```jsx
let numerosAEnteros = [1, 2, 3, 4, 5]
let numerosElevados = numerosAEnteros.map((elemento) => Math.pow(elemento, 2))
console.log(numerosAEnteros)
console.log(numerosElevados)
//-->[1, 2, 3, 4, 5]
//-->[1, 4, 9, 16, 25]
```

El resultado de esta operación es la potencia de dos de cada elemento en el arreglo, en la primera sección nos aseguramos que fueran números los elementos que contiene el arreglo, y en este los mutamos. `Math.pow()` es un método que viene dentro de `Math` que es la librería de javascript para tratar operaciones matemáticas, `pow()` nos permite obtener la potencia del número que se le pasa en el primer argumento, elevado al número del segundo argumento.

> 💡**Nota:** Es posible hacer también que un número se eleve a una potencia si escribimos de la siguiente manera `elemento**2`

> 🐼 ⬅️ Te presento a mi amigo Panda, Él es programador y aprendió que el método `map()` no se utiliza para recorrer arreglos sino para hacer otras operaciónes cómo vimos antes. Sé cómo Panda no utilices el `map()` para simplemente recorrer el arreglo, déjale esta acción al `forEach()` o al ciclo `for`.

## find()

El método `find()` devolverá el primer valor que encuentre que sea compatible con el valor o la función que se la pasa cómo argumento. Veamos un ejemplo dónde validaremo si en un arreglo de edades hay alguien mayor de 18 años.

```jsx
let edades = [5, 10, 12, 18, 24, 22]
const encontrado = edades.find((elemento) => elemento >= 18)
console.log(encontrado)
//-->18
```

Cómo ves el resultado de esta operación es el elemento `18` esto es porque es el elemento que cumple la condición que se le describe en la función `elemento ≥ 18` dónde le decimos al método cque encuentre el elemento que sea mayor o igual a `18`.

**También podríamos buscar** en un arreglo de objetos, imaginemos que tenemos un arreglo dónde ordenamos los datos de mascotas que han visitado el veterinario con sus edades y nombres, entonces decidimos buscar por el nombre de la mascota ya que queremos saber si fué atendido y si no tiene enfermedades.

```jsx
let mascotas = [
  { tipo: 'perro', nombre: 'zeus', edad: '17', atendido: true, enfermedad: 'saludable' },
  { tipo: 'gato', nombre: 'michi', edad: '10', atendido: true, enfermedad: 'parasitos' },
  { tipo: 'pato', nombre: 'donald', edad: '5', atendido: true, enfermedad: 'saludable' },
  { tipo: 'jirafa', nombre: 'pablo', edad: '10', atendido: true, enfermedad: 'saludable' },
]
function atendido(mascota) {
  return fruta.nombre === 'pablo'
}
const mascota = mascotas.find(atendido)
console.log(mascota.atendido, mascota.enfermedad)
//-->true, "saludable"
```

Gracias a este método rápido podemos saber que pablo fué atendido y está saludable, sólo cón buscar en las propiedades `mascota.atendido` y `mascota.enfermedad` y podemos decirle al cliente que su mascota está saludable 🙂.

> 💡**Nota:** Si en lugar de obtener de resultado el elemento en sí mismo, podrías usar el método `findIndex()` el cuál te devolverá el índice que tiene el elemento

## some()

Este método comprueba si al menos un elemento del arreglo que se evalúa cumple con la condición que se le especifíca en la función pasada cómo argumento.

Consideraciónes importante al utilizar el método `some()`.

- `some()` verifica si algún elemento pasa una prueba (provista por la función).
- `some()` ejecuta la función por cada elemento presente en el arreglo:
  - Si encuentra un elemento dónde la función retorna un valor `true` el método se detiene y devuelve `true` , sin verificar los otros elementos restantes del arreglo.
- No se ejecuta sin pasarle argumentos.
- No muta el arreglo original.

Para ilustrar cómo funciona este método tomemos cómo ejemplo el arreglo anterior de las mascotas que fueron al veterinario y evaluemos si algúna mascota está enferma, para que sea atendida en cirujía de inmediato.

```jsx
let mascotas = [
  { tipo: 'perro', nombre: 'zeus', edad: '17', atendido: true, enfermedad: 'saludable' },
  { tipo: 'gato', nombre: 'michi', edad: '10', atendido: true, enfermedad: 'parasitos' },
  { tipo: 'pato', nombre: 'donald', edad: '5', atendido: true, enfermedad: 'saludable' },
  { tipo: 'jirafa', nombre: 'pablo', edad: '10', atendido: true, enfermedad: 'saludable' },
]
function atendido(mascota) {
  return mascota.enfermedad !== 'saludable'
}
console.log(mascotas.some(atendido))
//-->true
```

El resultado es `true` porque hay una mascota que michi que se encuentra con parásitos. La condición de evaluación es que encuentre un elemento que sea distinto de `'saludable'`.

## every()

Eel método `every()` nos devolverá `true` cuándo **TODOS** los elementos del arreglo cumplan con la condicion que se le establece en la función.

Para ilustrar el ejemplo de nuevo hagamos uso de nuestro arreglo de mascotas, pero esta vez verifiquemos que niguna mascota ha quedado por fuera sin atenderse ya que su salud es importante.

```jsx
let mascotas = [
  { tipo: 'perro', nombre: 'zeus', edad: '17', atendido: true, enfermedad: 'saludable' },
  { tipo: 'gato', nombre: 'michi', edad: '10', atendido: true, enfermedad: 'parasitos' },
  { tipo: 'pato', nombre: 'donald', edad: '5', atendido: true, enfermedad: 'saludable' },
  { tipo: 'jirafa', nombre: 'pablo', edad: '10', atendido: true, enfermedad: 'saludable' },
]
function atendido(mascota) {
  return mascota.atendido === true
}
console.log(mascotas.every(atendido))
//-->true

//Si hacemos un pequeño cambio en el arreglo, cambiando el estado de donald a false
let mascotas = [
  { tipo: 'perro', nombre: 'zeus', edad: '17', atendido: true, enfermedad: 'saludable' },
  { tipo: 'gato', nombre: 'michi', edad: '10', atendido: true, enfermedad: 'parasitos' },
  { tipo: 'pato', nombre: 'donald', edad: '5', atendido: false, enfermedad: 'saludable' },
  { tipo: 'jirafa', nombre: 'pablo', edad: '10', atendido: true, enfermedad: 'saludable' },
]
function atendido(mascota) {
  return mascota.atendido === true
}
console.log(mascotas.every(atendido))
//-->false
```

Vemos cómo claramente en el ejemplo obtenemos una respuesta afirmativa para el primer arreglo pero para el segundo que tiene un elemento que es `false` la respuesta será `false` y de esto podemos concluir que no todas las mascotas han sido atendidas (en el segundo arreglo), y fueron atendidas todas (en el primer arreglo).

## reverse()

El método `reverse()` es una herramienta que se utiliza para -cómo su nombre lo indica- revertir el orden de los elementos en el arreglo. Cosas de las que hay que tener cuidado:

- El método `reverse()` es destructivo, quiere decir que modifica el arreglo original con el nuevo arreglo revertido.
- El último elemento pasa a ser el primero y el primero pasa a ser el último.

Veamos un ejemplo sencillo que ilustra este método muy bien.

```jsx
const arrNums = ['uno', 'dos', 'tres']
console.log('arrNums antes: ', arrNums)
const revertido = arrNums.reverse()
console.log('arrNums revertido: ', revertido)

//-->"arrNums antes: ", ["uno", "dos", "tres"]
//-->"arreglo revertido: ", ["tres", "dos", "uno"]
//-->"arrNums después: ", ["tres", "dos", "uno"]
```

## sort()

El método `sort()` ordena los elementos de un arreglo localmente y devuelve el arreglo ordenad.

Consideraciónes de uso del método `sort()`

- La forma en que se basa para ordenar los elementos se basa al string y su valor Unicode

> Unicode es un estándar de codificación de caracteres diseñado para facilitar el tratamiento informático, transmisión y visualización de textos de numerosos idiomas y disciplinas técnicas, además de textos clásicos de lenguas muertas. El término Unicode proviene de los tres objetivos perseguidos: universalidad, uniformidad y unicidad. [wikipedia](https://es.wikipedia.org/wiki/Unicode)

```jsx
arr.sort([compareFunction])
```

- **compareFunction:** Es un parámetro opcional y sirve para especificar el orden en que queremos que se ejecute el `sort()` esta función permitirá controlar el patrón de orden del método.

Para entenderlo un poco veamos un ejemplo, en dónde descubriremos que este método hay que tratarlo sabiamente.

### Orden por tipos de datos

Vamos a utilizar el arreglo de frutas del pos anterior, así cómo uno de números y uno combinado con ambos tipos de datos.

```jsx
let frutas = ['manzana', 'pera', 'guanabana', 'lechoza', 'cambur']
console.log(frutas.sort()) //-->["cambur", "guanabana", "lechoza", "manzana", "pera"]

let numeros = [8, 4, 6, 1, 3, 10]
console.log(numeros.sort()) //-->[1, 10, 3, 4, 6, 8]

let arrTres = ['palabra', '1 palabra', '2 palabras', 'Palabra']
console.log(arrTres.sort()) //-->["1 palabra", "2 palabras", "Palabra", "palabra"]
```

> 💡Nota: El formato unicode organiza le asigna más jerarquía a los números, luego las palabras por orden lafabético, luego las mayúsculas, y luego las minúsculas.

Lo que aprendimos en estos ejemplos es:

- Los datos tipo STRING los organiza en orden alfabético.
- Los números en orden ascendente (pero esto no indica que luego del diez será en ascendente).
- Las mayúsculas tienen van primero y también en orden alfabético.

**¿Que hacemos entonces si queremos ordenar un arreglo de números?**

Para ordenar números utilizamos la función que se le puede pasar cómo atributo al método `compareFunction` de esta manera con una operación sencilla podremos hacer la validación de orden. Veamos el ejemplo que sigue.

```jsx
let numeros = [8, 4, 6, 1, 3, 10]
numeros.sort(function (a, b) {
  return a - b
})
console.log(numeros) //-->[1, 3, 4, 6, 8, 10]
```

## reduce()

El método `reduce()` nos permitirá reducir un arreglo mediante una función de reducción, devolviendo como resultado un único valor calculado.

```jsx
arr.reduce(function(total, valorActual, indiceActual, vector), valorinicial)
```

Expliquemos los parámetros.

1. **function():** parámetro requerido y será ejecutado en cada elemento del arreglo.
   - **total**: Requerido, es el resultado de la función retornada en el ciclo previo, se le llama también **acumulador.**
   - **valorActual:** Requerido, es el valor que tiene el elemento del arreglo en el momento de la iteración.
   - **indiceActual:** Opcional, el índice que corresponde al elemento actual del arreglo al momento de la iteración.
   - **vector:** Opcional, es el vector completo que se está siendo evaluado
2. **valorInicial:** Opcional, un valor que puede ser pasado para que sea el valor inicial.

Veamos el métod en acción, en el siguienta ejemplo.

```jsx
;[0, 1, 2, 3, 4].reduce(function (total, valorActual, indice, vector) {
  console.log(total, valorActual, indice, vector)
  return total + valorActual
})
//-->0, 1, 1, [0, 1, 2, 3, 4]
//-->1, 2, 2, [0, 1, 2, 3, 4]
//-->3, 3, 3, [0, 1, 2, 3, 4]
//-->6, 4, 4, [0, 1, 2, 3, 4]
```

Si nos limitamos a imprimir por console sólo el resultado obtendríamos el valor `6` solamente, la razón por la que decidí imprimir todos los parámetros es para que obervemos que podemos hacer uso de cualquiera de esas propiedades dentro de la función.

> 💡Nota: Es posible que querramos reducir un arreglo pero no de la manera por defecto sino que todos los valores sean en base al último elemento, para esto existe la variación de este método llamada `reduceRight()` en este caso el primer parámetro de la función que también es llamado `valorAnterior` adquiere el valor del último elemento al iniciar la iteración, en lugar del primero.

## filter()

Este método crea un nuevo arreglo con todos los elementos que cumplan con la codición que se le establece en la función que recibe como parámetro.

Imaginemos el filter como un discriminador/colador que dejará pasar sólo a los que cumplan con una condición.

Otra manera de entender el `filter()` es imaginandonos que estamos en una linea de espera para entrar a un concierto y el guardespaldas de la entrada es el método `filter()` su función es dejar pasar sólo aquellos que tengan un boleto de entrada válido.

Veamos un ejemplo para ilustrar este método.

```jsx
const words = ['bicicleta', 'caballo', 'gobierno', 'mirada', 'fiesta', 'presente']

const result = words.filter((word) => word.length > 6)

console.log(result) //-->["bicicleta", "caballo", "gobierno", "presente"]
```

Como ya viste el nuevo arreglo sólo contendrá las palabras que tengan una longitud mayor a 6 (sin incluir el 6).
