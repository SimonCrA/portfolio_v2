---
title: 'Crea un CV dinámico con LaTeX y github Actions'
description: 'Automatiza tu curriculum vitae sin mucho esfuerzo con github y LaTeX'
publishDate: 'Apr 08 2025'
tags: ['github', 'actions', 'latex']
slug: 'cv/github-latex'
image: '/posts/post4.webp'
---

# Introducción


Al igual que todos en algún momentos de nuestra carrera profesional necesitamos actualizar nuestro curriculum, y esta he tenido que hacerla en varias ocasiones pero estaba cansado de tener que modificarlo y cambiar en todos los lugares dónde lo tenía también, quería algo más centralizado y dinámico, que me permitiera actualizarlo y además se reflejara en todos los lugares que me interesaban. 

Hoy te enseñaré cómo hice para crear mi CV, subirlo a github y que al momento de subirlo me generara de una vez un link con el pdf y la posibilidad de poder descargarlo. Este link luego lo puedes poner en tu portafolio o cualquier lugar de interés.

>💡 TL;DR → Puedes ir a este [repositorio](https://github.com/SimonCrA/cv_dynamic) y hacer un fork (ó clonas el repositorio), luego, `git clone` del proyecto en tu directorio local, reemplazas el contenido del archivo `resume.tex` por tu trayectoria profesional. Realizas el commit con tus nuevos cambios y deberías tener un CV en formato PDF listo para usar.

## Creación directorio y repositorio

Lo primero que haremos es crear un directorio en nuestro disco local (dónde tengamos nuestros proyectos personales o documentos) y accedemos a este nuevo directorio. 

```bash
mkdir cv_dynamic
cd cv_dynamic
```

Iniciamos git para el control de versiones de nuestro CV, y nos vamos a github y creamos un nuevo repositorio y tomamos el link del repositorio y lo pegamos al lado de `origin` .

```bash
git init
git remote add origin <repo en github>

```

Esto vinculará nuestra carpeta local con el repositorio remoto. Dejaremos esto por aquí porque lo siguiente es tener nuestro CV listo.

## Preparación de CV en LaTeX

Para mi curriculum decidí utilizar LaTeX porque nos permite al compilarlo generar un PDF mucho más profesional.

>💡 LaTeX es un **lenguaje de composición tipográfica que se usa para crear documentos con alta calidad, especialmente científicos y técnicos.**

Esto lo hice en la aplicación más popular para crear documentos científicos. ***overleaf***. Aquí deberás crear una cuenta, buscar las plantillas disponibles y escoger una. Luego vacías todos tus datos en la plantilla. (Esto lo puedes hacer directo en tu editor de código si ya sabes utilizar LaTeX)

>📢 Aquí no nos centraremos en aprender LaTeX, pero a muy alto nivel **permite crear formulas matemáticas,** el formato se parece a html porque **tiene tags que pueden dividir seccione**s y **separa el contenido y la estructura de su formato**. La extensión de un documento LaTeX es `.tex`  y a veces puede contener un archivo `.cls`  que lo acompaña y este determina las clases que se aplicarán en el documento.

Regresamos a nuestro proyecto vinculado con github. Procedemos a crear un archivo en el directorio raíz de nuestro proyecto con el nombre que querramos pero puede ser **resume.tex.**

```bash
touch resume.tex
```

En este archivo vaciaremos nuestro contenido con el curriculum terminado en ***overleaf.***

>💡 Si en ***overleaf*** la plantilla que escogimos tiene un `.cls` , debemos también crear ese archivo en nuestro proyecto y pegar el contenido que tenga (colocar al mismo nivel en dónde esta nuestro archivo `.tex` )

Procedemos a realizar nuestro primer commit y subimos nuestros cambios a github.

```bash
git add .
git commit -m "primer commit"
git push
```

## Creación de la acción de github

Ultima parte y la más divertida, agregar un workflow para github Actions que compile y genere nuestro pdf con el contenido que tiene `resume.tex`

Creamos un directorio en nuestra raíz del proyecto con el siguiente nombre `.github/workflows/` y dentro del directorio `workflows/`, agregamos un archivo  con el nombre `cv.yml` procedemos a pegar el siguiente contenido en el archivo.

```yaml
name: Build LaTeX document
on: [push]
jobs:
  build_latex:
    runs-on: ubuntu-latest
    steps:
	    # seccion 1
      - name: Set up Git repository
        uses: actions/checkout@v4
			# seccion 2
      - name: Compile LaTeX english
        uses: xu-cheng/latex-action@v3
        with:
          root_file: resume.tex
			# seccion 3
      - name: Upload PDF
        uses: actions/upload-artifact@v4
        with:
          name: resume.pdf
          path: resume.pdf
			# seccion 4
      - name: Commit PDFs
        run: |
          git config --global user.name "PDF Updater Bot"
          git config --global user.email "pdf-bot@example.com"
          git checkout main
          git add resume.pdf

          # Commit only if changes exist
          if git diff-index --quiet HEAD --; then
            echo "No changes to commit."
          else
            git commit -m "Auto-update PDFs [skip ci]"
            git push https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git main
          fi

```

>⚠️ Es probable que falle el build al querer hacer commit del archivo en la seccion 4, esto se debe a que hay que darle permisos al workflow para que pueda hacer commits, de esta manera.  <br><br> 1. en github, ve al repositorio y ve a configuración→Acciones→General <br> 2. Debajo de permisos del workflow, seleccionar la casilla ***Permisos de leer y escribir.*** <br>3. Guardar los cambios.

Al intentar hacer el build de nuevo debería funcionar y al refrescar ver el archivo que generaste.

Este archivo consta de una configuración yaml, que le dirá a github que compile nuestro CV, generando así un PDF, lo suba a nuestro repositorio creando un commit en el directorio raíz del proyecto.

>💡 Recordemos que un github action creará una instancia de SO con ubuntu por un tiempo determinado, en el cuál podremos hacer operaciónes como si tuvieramos una maquina virtual, y luego, al terminar la ejecución se destruirá.

El repositorio que estamos utilizando (en la sección #2) para compilar nuestro CV es `xu-cheng/latex-action@v3`  y este repositorio tiene todo lo necesario para crear un PDF desde un archivo LaTeX. 

Se procede a subir el PDF generado (seción #3) como un `artifact`  (un artefacto son archivos que pueden ser recuperados luego de que la instancia de github actions muera y se elimine).

Luego para finalizar (secció #4) se realiza un commit (desde un bot dentro de la instancia de github actions) a nuestro repositorio que contendrá el archivo PDF de nuestro CV.
