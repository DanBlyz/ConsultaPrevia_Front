import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output, 
  ViewChild,
  ElementRef
} from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { Codificador } from 'src/app/comun/modelos';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-correspondencia-vista-servicios-registrados-cpt',
  templateUrl: './vista-servicios-registrados-cpt.component.html',
  styles: []
})
export class VistaServiciosRegistradosCptComponent
  implements OnInit, OnDestroy
{
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formCpt: FormGroup;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private _location: Location
  ) {

  }

  ngOnInit(): void {

  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'seleccionar-servicios': {
        
        break;
      }
      case 'cancelar-lista': {
        break;
      }
    }
  }

  ejecutarAccion(accion: string): void {
    //let vistaServiciosRegistrados = new VistaServiciosRegistrados();
    switch (accion) {
      case 'crear': {
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
    }
  }

  goBack(){
    this._location.back();
  }

  convertToPDF() {

    html2canvas(document.querySelector("#capture")).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');
        var imgWidth = 226;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
  
        var doc = new jsPDF();
        var position = 0;
  
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
            heightLeft -= pageHeight;
        }
      doc.save("Dashboard.pdf");
      });
    }
  //   const DATA = document.getElementById('capture');
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   const options = {
  //     background: 'white',
  //     scale: 3
  //   };
  //   html2canvas(DATA, options).then((canvas) => {
  //       const img = canvas.toDataURL('image/PNG');
  
  //       // Add image Canvas to PDF
  //       const bufferX = 15;
  //       const bufferY = 15;
  //       const imgProps = (doc as any).getImageProperties(img);
  //       const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //       doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  //       return doc;
  //     }).then((docResult) => {
  //       docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
  //   });
  // }

  // html2canvas(document.querySelector("#capture")).then(canvas => {
  //   const contentDataURL = canvas.toDataURL('image/png')
  //   let pdf = new jsPDF();
  //   var width = pdf.internal.pageSize.getWidth();
  //   var height = canvas.height * width / canvas.width;
  //   pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
  //   pdf.save('output.pdf');
  //   });
  // }
}
