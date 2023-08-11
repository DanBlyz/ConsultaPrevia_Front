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
      const mainHeaders = ["Correlativo", "C. Unico","Area Minera", "Clasificacion", "N. Cuadricula", "Dpto.","Provincia","Municipio","Estado"];
      const mainData = data.map(item => [item.correlativo, item.codigoUnico,item.areaMinera, item.clasificacion,item.nroCuadricula,item.departamento,item.provincia,item.municipio,item.estado]);
      let startY = 100;
      autoTable(doc,{
        head: [mainHeaders],
        body: mainData,
        startY: startY
      });
      data.forEach(item => {
        startY = (doc as any).lastAutoTable.finalY + 20;
        if (item.listaProvidencia !== undefined && Array.isArray(item.listaProvidencia)) {
          doc.setFontSize(15);
          doc.text("Contenido Correspondiente al Tramite "+item.correlativo, doc.internal.pageSize.width / 2, startY, { align: 'center' });
          const nestedHeaders = ["Tramite","Correlativo Providencia","Referencia"];
          const nestedData = item.listaProvidencia.map(res =>[item.correlativo,res.correlativo, res.referencia]);
          if(item.listaProvidencia.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 30; 
            autoTable(doc,{
              head: [nestedHeaders],
              body: nestedData,
              startY: startY
            });
          }
        }
        if (item.listaResolucion !== undefined && Array.isArray(item.listaResolucion)) {
          const nestedHeaders = ["Tramite","Informe","Resolucion","Informe Aprobado","Acto Administrativo","Referencia"];
          const nestedData = item.listaResolucion.map(res => {
            const informeAprobado = res.informeAprobado ? "SI": "NO";
            const actoAdministrativo = res.actoAdministrativo ? "SI": "NO";

            return [item.correlativo,res.informe, res.resolucion,informeAprobado, actoAdministrativo,res.referencia];
          });
       
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
          const nestedHeaders = ["Trámite ", "Correlativo Informe", "Referencia"];
          const nestedData = item.listaInforme.map(res => [item.correlativo, res.correlativo, res.referencia]);
          if(item.listaInforme.length > 0){
            startY = (doc as any).lastAutoTable.finalY + 20; 
            autoTable(doc, {
            head: [nestedHeaders],
            body: nestedData,
            startY: startY
          });
          }
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
          const nestedHeaders = ["Tramite","Notificado","Direccion Dpto"];
          const nestedData = item.listaNotificacion.map(res =>[item.correlativo,res.notificado, res.direccionDpto]);
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
          const nestedHeaders = ["Tramite","Viaje Realizado","Pago Realizado","Dias Viaje","Tipo Viaje","Monto Total","APM","Descripcion"];
          
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
    generarPdfCpt(data: any, cadena: string){
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
      });
      const [totalRegistros,fecha, hora] = cadena.split("-");
      doc.setFontSize(20);
      doc.text("PROFORMA DE PAGO", doc.internal.pageSize.width / 2, 35, { align: 'center' });
      doc.setFontSize(10);
      doc.text("Fecha y Hora Generacion  "+ fecha + " a horas "+hora, doc.internal.pageSize.width / 2, 65, { align: 'center' });
      
      const imgData = 'assets/images/ajamfront.jpg'; // Reemplaza 'ruta_de_la_imagen.jpg' con la ruta de tu imagen
      const imageWidth = 90; // Ancho de la imagen en el PDF
      const imageHeight = 90; // Alto de la imagen en el PDF
      const xPosition = 2; // Posición X de la imagen centrada
      const yPosition = 5; // Posición Y de la imagen
      console.log(imgData)
      doc.addImage(imgData, 'JPG', xPosition, yPosition, imageWidth, imageHeight);
      const styles = {
        fontSize: 24, // Tamaño del texto en puntos
        textColor: [204, 102, 0] // Color marrón (moztaza) en formato RGB
      };
      const mainHeaders = ["CPT: "+'7056-6419-1632'];
      let startY = 100;
      autoTable(doc,{
        head: [mainHeaders],
        startY: startY,
        styles: {
          fontSize: 20,
          halign: 'center'
        },

      });
      startY = (doc as any).lastAutoTable.finalY + 20;
      const mainHeaders3 = ['DATOS DEL SOLICITANTE',''];
      const mainData3 = [
        ['TEL / CEL', '2825213'],
        ['REPRESENTANTE:', 'YERY'],
        ['CLASIFICACION:', 'COOPERATIVA']
      ];
      autoTable(doc, {
        head: [mainHeaders3],
        body: mainData3,
        startY: startY,
      })
      startY = (doc as any).lastAutoTable.finalY + 20;
      const mainHeaders4 = ['CALCULO DE LA DEUDA',''];
      const mainData4 = [
        ['CONCEPTO', 'CONSULTA - PREVIA'],
        ['MONTO A PAGAR:', 'BS '+ data.montoTotal +".- CIENTO CINCUETA Y CINCO 00/100.- BOLIVIANOS" ]
      ];
      autoTable(doc, {
        head: [mainHeaders4],
        body: mainData4,
        startY: startY
      })
      startY = (doc as any).lastAutoTable.finalY + 20;
      const mainHeaders5 = ['DETALLE DE CÁLCULO DE LIQUIDACIÓN DE VIATICOS Y','PASAJES','','',''];
      const mainData5 = [
        ['Servicios:', 'Nro. Dia (s)','Tipo de Viaje','Monto por Dia','Total Viaticos'],
        ['Viatico para la identificación de sujetos de consulta previa, dentro del trámite: AJAMD-LP-SOL-CAM/154/2018 del área denominada TOJRA RL, compuesta por 8 cuadrículas, ubicada en el municipio(s) CAJUATA, Provincia(s) INQUISIVI, departamento(s) LA PAZ.', '0.7','Intradepartamental',222,155 ]
      ];
      autoTable(doc, {
        head: [mainHeaders5],
        body: mainData5,
        startY: startY,
        styles: {
          halign: 'center'
        },
      })
      startY = (doc as any).lastAutoTable.finalY + 20;
      const mainHeaders6 = ['NOTAS'];
      const mainData6 = [['1. El pago podrá realizarse a través de cualquier SUCURSAL O AGENCIA DEL BANCO UNION, UNINET Y UNIMOVIL inidicando solamente el CPT que se muestra en la cabecera de la presente proforma'],
                         ['2. La presente Proforma de Pago tiene una validez de 30 dias calendario (Hasta el 30/11/2022) a partir de su fecha de generación. Posterior a esta fecha, se deberá generar una nueva Proforma de Pago.'],
                         ['3. El presente documento no se constituye en un instrumento válido para fines legales. El saldo adeudado está sujeto a actualización, validación y confirmación por parte de la Autoridad Jurisdiccional Administrativa Minera AJAM.'],
                         ['4. La impresión de la presente Proforma de Pago es opcional, para el pago ewn ewl Banco solo necesita el CPT que se muestra en la cabecera de la presente proforma.']
    ];
      autoTable(doc, {
        head: [mainHeaders6],
        body: mainData6,
        startY: startY
      })
      doc.output('dataurlnewwindow');
    }

}
