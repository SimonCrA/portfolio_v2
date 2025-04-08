---
title: 'Optimiza tus imagenes para la web'
description: 'Aprende a utilizar una libreria de google para convertir a .webp tus imagenes'
publishDate: 'Apr 08 2025'
tags: ['web', 'imagenes', 'optimizar']
slug: 'optimizar/imagenes-web'
image: '/posts/post5.webp'
---

# Introducción

Cuándo estamos construyendo aplicaciones o blogs para la WEB hay que tener en cuenta que cualquier archivo que no sea texto tendrá un peso asociado elevado, y esto para la WEB significa más tiempo de carga al momento de solicitar ese recurso al servidor que lo aloja. Para evitar esto y tener un buen rendimiento en nuestra web debemos buscar como optimizar nuestras imagenes.

Google desarrolló un formato de imagen que permite comprimir con y sin perdida de calidad disminuir el peso equivalente de una imagen y que así sea optimizada para la web. Este formato tiene por extensión `.webp`

Hay muchas herramientas online que permiten la transformación a este formato, pero si no quieres subir tus imagenes a estas herramientas online, o simplemente no tienes acceso a internet veremos una forma de generar este formato de manera local, o sea en nuestro computador y sin necesidad de una herramienta externa.

## Descargar el convertidor

Primero debemos [descargar el convertidor](https://developers.google.com/speed/webp/docs/precompiled), es una libreria que provee google que puedes instalar o usar la version precompilada. En esta oportunidad nos enfocaremos en la versión precompilada ya que es más fácil de configurar.

Luego de descargar procedemos a ubicarla en un directorio apropiado. 

>⚠️ Para windows, puedes extraer los ficheros descargados con winrar en `C:\libwebp` . Es importante resaltar que para la conversión deberás dirigirte a este directorio `C:\libwebp\bin` y aquí llamar a la herramienta que necesites.

>⚠️ Para linux,  deberás construir la libreria ya que no logré hacerlo funcionar con los precompilados. te diriges a esta [página](https://developers.google.com/speed/webp/docs/compiling#compiling_on_unix-like_platforms) y sigue las instrucciones de instalación y deberías tener los binarios instalados.

## Conversión de la imagen

Para la conversión sólo necesitas dos cosas, completar el paso anterior y tener la imagen que quieras convertir. 

Nos ubicamos en el directorio de la imagen y procedemos con la conversión.

### Windows

```powershell
C:\libwebp\bin\cwebp.exe -q prueba.png -o prueba.webp
```

### Linux

```bash
cwebp -q 100 prueba.png -o prueba.webp
```

el flag `-q` indica a que porcentaje de calidad la queremos de la original. por defecto es 75% y el flag `-o` indica como se llamará el archivo de salida. 

Al presionar enter obtendremos un nuevo archivo listo con el formato .webp que pesa mucho menos que el original y está adaptado para la web.

Espero que esto te haya servido y con esto mejores el rendimientode tu web, sigue divirtiendote y recuerda que con esta libreria puedes decodificar también imagenes que están en formato `.webp` a cualquier formato que quieras (***usando el comando dwebp***), también puede convertir GIFs en su versión en `.webp` . Si quieres saber qué cosas se pueden hacer con cada comando puedes escribir `cwebp -help`
