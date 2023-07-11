<p align="center">
  <a href="https://ajam.gob.bo/" target="blank"><img style="max-width: 300px;" src="https://ajam.gob.bo/portal_frontend/assets/img/logo-ajam.png" alt="AJAM" /></a>
</p>

# comun - Módulo para Angular

Módulo de componentes y funciones transversales para proyectos que utilizan el framework Angular.

> Para mayor información sobre Angular, visitar [https://angular.io](https://angular.io)

## Instalación

Desde la raíz del proyecto clonamos el proyecto desde el Repositorio Estatal de Software Libre.
```bash
$ cd src/app
$ git submodule add https://gitlab.softwarelibre.gob.bo/adsib/modulos-angular/comun.git comun
```

Instalamos los paquetes necesarios para el correcto funcionamiento del módulo.
```bash
$ npm install --save file-saver
$ npm install --save-dev @types/file-saver
$ ng add @ngrx/store
# TODO: Analizar la pertinencia de incluir el paquete @ng-bootstrap/ng-bootstrap@11
$ ng add @ng-bootstrap/ng-bootstrap@11
```

## Licencia

[LICENCIA PÚBLICA GENERAL](LICENSE.md)<br>
de Consideraciones y Registro de Software Libre en Bolivia<br>(LPG-Bolivia)
