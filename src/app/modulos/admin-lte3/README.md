<p align="center">
  <a href="https://ajam.gob.bo/" target="blank"><img style="max-width: 300px;" src="https://ajam.gob.bo/portal_frontend/assets/img/logo-ajam.png" alt="AJAM" /></a>
</p>

# admin-lte3 - Módulo para Angular

Módulo de componentes de estructura visual, basado en la plantilla AdminLTE 3.

> Para mayor información sobre AdminLTE, visitar [https://adminlte.io](https://adminlte.io)

## Instalación

Desde la raíz del proyecto clonamos el proyecto desde el Repositorio Estatal de Software Libre.
```bash
$ cd src/app/modulos
$ git submodule add https://gitlab.softwarelibre.gob.bo/adsib/modulos-angular/admin-lte3.git admin-lte3
```

Instalamos los paquetes necesarios para el correcto funcionamiento del módulo.
```bash
$ npm install --save bootstrap@4.6.0 bootstrap-select jquery
$ ng add @ng-bootstrap/ng-bootstrap@11
$ ng add @ng-select/ng-select
$ npm install --save ngx-toastr
$ npm install --save ngx-spinner
$ npm install --save @fortawesome/fontawesome-free@5
$ npm install --save overlayscrollbars
$ npm install --save moment
$ npm install --save sweetalert2
```

> **IMPORTANTE:** A la fecha de elaboración de este proyecto, la versión de la plantilla utilizada solo soporta **Bootstrap 4.6.0**.

Modificamos el archivo **angular.json**.
```json
"styles": [
  "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  "node_modules/overlayscrollbars/css/OverlayScrollbars.min.css",
  "src/assets/admin-lte3/scss/adminlte.scss",
  "src/styles.scss"
],
"scripts": [
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
  "node_modules/overlayscrollbars/js/jquery.overlayScrollbars.min.js",
  "node_modules/moment/min/moment.min.js",
  "src/assets/admin-lte3/js/adminlte.min.js"
]
```

Agregamos el tipo de letra de la plantilla en el archivo **index.html**
```html
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
```

Descargamos la versión 3.2.x de la plantilla Admin LTE desde su [repositorio oficial](https://github.com/ColorlibHQ/AdminLTE/releases).

Creamos la carpeta **admin-lte3** dentro la carpeta **assets** del proyecto y en su interior copiamos las carpetas:
- build/scss
- dist/img
  - AdminLTELogo.png
  - boxed-bg.jpg
  - boxed-bg.png
  - unknown.jpg (imagen no incluída en la plantilla)
- dist/js

Si al momento de ejecutar la aplicación principal se presenta el siguiente error **SassError: Top-level selectors may not contain the parent selector "&".**, debemos modificar los siguientes archivos:

- src/assets/admin-lte3/scss/mixins/_backgrounds.scss (línea 7)
- src/assets/admin-lte3/scss/mixins/_toasts.scss line (línea 7)

cambiamos **&.bg-#{$name}** por **#{if(&, '&.bg-#{$name}','.bg-#{$name}')}**

## Licencia

[LICENCIA PÚBLICA GENERAL](LICENSE.md)<br>
de Consideraciones y Registro de Software Libre en Bolivia<br>(LPG-Bolivia)
