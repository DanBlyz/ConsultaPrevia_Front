import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { AppState } from 'src/app/app.state';
import { ServicioMetodosBaseService } from 'src/app/comun/servicios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor() { }

  /*imprimirPdf(encabezado: string[], cuerpo: Array<any>,titulo: string, guardar?: boolean) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "letter"
    });
    doc.text(titulo, doc.internal.pageSize.width / 2, 25, { align: 'center' });
    autoTable(doc, {
      head: [encabezado],
      body: cuerpo,
      startY: 30 // Posición inicial para la tabla
    });
  
    if (guardar) {
      const hoy = new Date();
      doc.save(`${titulo}_${hoy.getDate()}_${hoy.getTime()}.pdf`);
    } else {
      // Puedes utilizar doc.output('dataurlnewwindow') para abrir el PDF en una nueva ventana del navegador
    }
  }*/
 /* generatePdf(data: any[], title: string): void {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
      });

      doc.text(title, doc.internal.pageSize.width / 2, 25, { align: 'center' });

      const header = Object.keys(data[0]);
      const body: any[] = [];

      data.forEach(item => {
        const rowData = [];
        Object.values(item).forEach(value => {
          if (Array.isArray(value)) {
            value.forEach(nestedItem => {
              rowData.push(Object.values(nestedItem));
            });
          } else {
            rowData.push(value);
          }
        });
        body.push(rowData.flat());
      });

      autoTable(doc,{
        head: [header],
        body: body,
        startY: 40
      });

      doc.save(`${title}.pdf`);
    }*/
    generatePdf(data: any[], cadena: string, filtro: string[]): void {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
      });
      const [totalRegistros,fecha, hora] = cadena.split("-");
      doc.setFontSize(20);
      doc.text("Reporte Tramite", doc.internal.pageSize.width / 2, 35, { align: 'center' });
      doc.setFontSize(15);
      doc.text("Nro de Registros encontrados ("+ totalRegistros+")", doc.internal.pageSize.width / 2, 50, { align: 'center' });
      doc.setFontSize(10);
      doc.text("Fecha Generacion Reporte "+ fecha + " a horas "+hora, doc.internal.pageSize.width / 2, 65, { align: 'center' });
      if(filtro.length > 0){
        doc.setFontSize(10);
      doc.text("Filtro(s) por "+filtro, doc.internal.pageSize.width / 2, 80, { align: 'center' });
      }
      const imgData = 'assets/images/ajamfront.jpg'; // Reemplaza 'ruta_de_la_imagen.jpg' con la ruta de tu imagen
      const imageWidth = 90; // Ancho de la imagen en el PDF
      const imageHeight = 90; // Alto de la imagen en el PDF
      const xPosition = 2; // Posición X de la imagen centrada
      const yPosition = 5; // Posición Y de la imagen
      console.log(imgData)
      doc.addImage(imgData, 'JPG', xPosition, yPosition, imageWidth, imageHeight);

    
      // Encabezados de la tabla principal
      const mainHeaders = ["Correlativo", "C. Unico","Area Minera", "Clasificacion", "N. Cuadricula", "Dpto.","Provincia","Municipio","Estado"];
    
      // Cuerpo de la tabla principal
      const mainData = data.map(item => [item.correlativo, item.codigoUnico,item.areaMinera, item.clasificacion,item.nroCuadricula,item.departamento,item.provincia,item.municipio,item.estado]);
   
      // Posición inicial para la tabla
      let startY = 100;
    
      // Generar la tabla principal
      autoTable(doc,{
        head: [mainHeaders],
        body: mainData,
        startY: startY
      });
    
      // Recorrer los datos anidados y generar las tablas internas
      data.forEach(item => {
        startY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(15);
        doc.text("Contenido Correspondiente al Tramite "+item.correlativo, doc.internal.pageSize.width / 2, startY, { align: 'center' });
        if (item.listaProvidencia !== undefined && Array.isArray(item.listaProvidencia)) {
          // Encabezados de la tabla anidada
          const nestedHeaders = ["Tramite","Correlativo Providencia","Referencia"];
    
          // Cuerpo de la tabla anidada
          const nestedData = item.listaProvidencia.map(res =>[item.correlativo,res.correlativo, res.referencia]);
    
          // Generar la tabla anidada
          if(item.listaProvidencia.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 30; // Espacio entre tablas
            autoTable(doc,{
              head: [nestedHeaders],
              body: nestedData,
              startY: startY
            });
          }
        }
        if (item.listaResolucion !== undefined && Array.isArray(item.listaResolucion)) {
          // Encabezados de la tabla anidada
          const nestedHeaders = ["Tramite","Informe","Resolucion","Informe Aprobado","Acto Administrativo","Referencia"];
          const nestedData = item.listaResolucion.map(res => {
            const informeAprobado = res.informeAprobado ? "SI": "NO";
            const actoAdministrativo = res.actoAdministrativo ? "SI": "NO";

            return [item.correlativo,res.informe, res.resolucion,informeAprobado, actoAdministrativo,res.referencia];
          });
          // Cuerpo de la tabla anidada
    
          // Generar la tabla anidada
       
          if(item.listaResolucion.length>0){
            startY = (doc as any).lastAutoTable.finalY + 20; // Espacio entre tablas
            autoTable(doc,{
              head: [nestedHeaders],
              body: nestedData,
              startY: startY
            });
          }
        }
        if (item.listaInforme !== undefined && Array.isArray(item.listaInforme)) {
          // Encabezados de la tabla anidada
          const nestedHeaders = ["Trámite ", "Correlativo Informe", "Referencia"];
          // Cuerpo de la tabla anidada
          const nestedData = item.listaInforme.map(res => [item.correlativo, res.correlativo, res.referencia]);
          // Generar la tabla anidada
          if(item.listaInforme.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 20; // Espacio entre tablas
            autoTable(doc, {
            head: [nestedHeaders],
            body: nestedData,
            startY: startY
          });
          }
      
          // Tabla para item.listaInforme[i].listaSujetoIdentificado
          item.listaInforme.forEach(informe => {
            if (informe.listaSujetoIdentificado !== undefined && Array.isArray(informe.listaSujetoIdentificado)) {
              const sujetoHeaders = ["Informe de Procedencia","Comunidad", "Autoridad", "Teléfono"];
              const sujetoData = informe.listaSujetoIdentificado.map(sujeto => [informe.correlativo,sujeto.comunidad, sujeto.autoridad, sujeto.telefono]);
             if(informe.listaSujetoIdentificado.length > 0){
              startY = (doc as any).lastAutoTable.finalY + 20; // Espacio entre tablas
              autoTable(doc, {
                head: [sujetoHeaders],
                body: sujetoData,
                startY: startY
              });
             }
            }
          });
        }
        if (item.listaNotificacion !== undefined && Array.isArray(item.listaNotificacion)) {
          // Encabezados de la tabla anidada
          const nestedHeaders = ["Tramite","Notificado","Direccion Dpto"];
    
          // Cuerpo de la tabla anidada
          const nestedData = item.listaNotificacion.map(res =>[item.correlativo,res.notificado, res.direccionDpto]);
    
          // Generar la tabla anidada
          if(item.listaNotificacion.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 20; // Espacio entre tablas
            autoTable(doc,{
            head: [nestedHeaders],
            body: nestedData,
            startY: startY
          });
          }
        }
        if (item.listaActoAdministrativo !== undefined && Array.isArray(item.listaActoAdministrativo)) {
          console.log("yery")
          // Encabezados de la tabla anidada
          const nestedHeaders = ["Tramite","Viaje Realizado","Pago Realizado","Dias Viaje","Tipo Viaje","Monto Total","APM","Descripcion"];
    
          // Cuerpo de la tabla anidada
          
            const nestedData = item.listaActoAdministrativo.map(res => {
              const pagoRealizado = res.pagoCpt ? res.pagoCpt.pagoRealizado ? "SI": "NO": null;
              const diasViaje = res.pagoCpt ? res.pagoCpt.diasViaje : null;
              const tipoViaje = res.pagoCpt ? res.pagoCpt.tipoViaje : null;
              const montoTotal = res.pagoCpt ? res.pagoCpt.montoTotal : null;
              const apm = res.pagoCpt ? res.pagoCpt.apm : null;
              const descripcion = res.pagoCpt ? res.pagoCpt.descripcion : null;
              const viajeRealizado =  res.viajeRealizado ? "SI": "NO";

              return [item.correlativo, viajeRealizado, pagoRealizado,diasViaje,tipoViaje,montoTotal,apm,descripcion];
            });
    
          // Generar la tabla anidada
          if(item.listaActoAdministrativo.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 20; // Espacio entre tablas
            autoTable(doc,{
            head: [nestedHeaders],
            body: nestedData,
            startY: startY
          });
          }
        }
      });
    
     //doc.save(`${cadena}.pdf`);
     doc.output('dataurlnewwindow');
    }
  
}
