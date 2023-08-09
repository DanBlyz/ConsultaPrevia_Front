import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';

import { Resolucion } from '../../../modelos';
import { ResolucionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-correspondencia-resolucion-formulario',
  templateUrl: './resolucion-formulario.component.html',
  styles: []
})
export class ResolucionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  arr = this.router.url.split('/');
  selectedFile: File | null = null;
  suscripcion = new Subscription();

  formResolucion: FormGroup;
  botonOperacion: string;

  resolucion: Resolucion;
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private resolucionFacade: ResolucionFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    if (!this.resolucion) {
      this.resolucion = new Resolucion();
    }

    this.formResolucion = this.fb.group({
      informe: ['', Validators.required],
      resolucion: ['', Validators.required],
      informeAprobado: ['', Validators.required],
      actoAdministrativo: ['', Validators.required],
      referencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.resolucionFacade.CorrespondenciaState$.subscribe(({ resolucion }) => {
        if (resolucion) {
          this.resolucion = resolucion;
          if (this.tipoOperacion === 'modificar' && this.resolucion.id) {
            this.formResolucion.setValue({
              informe: this.resolucion.informe,
              resolucion: this.resolucion.resolucion,
              informeAprobado: this.resolucion.informeAprobado,
              actoAdministrativo: this.resolucion.actoAdministrativo,
             // resolucionPdf: this.resolucion.resolucionPdf,
              referencia: this.resolucion.referencia
            });
            if(this.resolucion.resolucionPdf !== null){
              this.downloadFile(this.resolucion.resolucionPdf);
            }
          }
        }
      })
    );

    switch (this.tipoOperacion) {
      case 'crear':
        this.botonOperacion = 'Guardar';
        break;
      case 'modificar':
        this.botonOperacion = 'Modificar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let resolucion = new Resolucion();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formResolucion);
        if (!this.formResolucion.valid) {
          this.formResolucion.markAllAsTouched();
          return;
        }
        resolucion = { ...this.formResolucion.value };
        this.accion.emit({
          accion: 'guardar',
          resolucion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formResolucion);
        if (!this.formResolucion.valid) {
          this.formResolucion.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        
        formData.append('file',this.selectedFile,"resolucion-"+this.selectedFile.name.replace("resolucion-",""));
        this.http.post<any>('http://localhost:3000/resoluciones/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        resolucion = { ...this.formResolucion.value };
        resolucion.flujo = this.arr[1];
        resolucion.resolucionPdf = "resolucion-"+this.selectedFile.name.replace("resolucion-","");
        this.accion.emit({
          accion,
          resolucionId: this.resolucion.id,
          resolucion
        });
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.nombreArchivoSeleccionado = file.name;
    } else {
      this.nombreArchivoSeleccionado = 'Seleccionar archivo PDF...';
    }
  }
  
  downloadFile(nombre : string) {
    // Aquí realiza una solicitud al servidor para obtener los datos del archivo
    const filename = nombre;
    const url = `http://localhost:3000/resoluciones/bajar-archivo/${filename}`;
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data) => {
        const file = new Blob([data], { type: 'application/octet-stream' });
        this.selectedFile = new File([file], filename); // Puedes cambiar el nombre del archivo según corresponda
        console.log(this.selectedFile.name);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
}
