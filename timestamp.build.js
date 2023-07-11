/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const replaceFile = require('replace-in-file');
const angular = require('./angular.json');

const defaultProject = process.argv[2];

const rutaRelativa = [
  'projects',
  defaultProject ? defaultProject : angular.defaultProject,
  'architect',
  'build',
  'options',
  'outputPath'
].reduce(
  (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
  angular
);

const instante = new Date().getTime();
const index = __dirname + '/' + rutaRelativa + '/' + 'index.html';
console.log('Procesando ' + index);
console.log('...');
fs.readdir(__dirname + '/' + rutaRelativa + '/', (err, archivos) => {
  archivos.forEach((archivo) => {
    if (
      archivo.match(
        /^(es2015-polyfills|main|polyfills|runtime|scripts|styles).+([A-Za-z0-9\s.\-])*(js|css)$/g
      )
    ) {
      console.log(archivo + ' --> ' + archivo + '?t=' + instante);
      reemplazar(index, archivo, archivo + '?t=' + instante);
    }
  });
});

function reemplazar(archivo, cadenaOrigen, cadenaDestino) {
  const options = {
    files: [archivo, archivo],
    from: '"' + cadenaOrigen + '"',
    to: '"' + cadenaDestino + '"',
    allowEmptyPaths: false
  };
  try {
    let respuesta = replaceFile.sync(options);
    if (respuesta == 0) {
      console.log('Error al reemplazar');
    } else if (respuesta[0].hasChanged === false) {
      console.log('No se pudo realizar el reemplazo.');
    } else {
      console.log('Reemplazo satisfactorio.');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
