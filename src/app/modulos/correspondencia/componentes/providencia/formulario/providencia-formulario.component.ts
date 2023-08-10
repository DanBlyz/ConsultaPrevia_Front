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

import { Providencia } from '../../../modelos';
import { ProvidenciaFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';
import { VistaDocumentoService } from '../../../servicios';

@Component({
  selector: 'app-correspondencia-providencia-formulario',
  templateUrl: './providencia-formulario.component.html',
  styles: []
})
export class ProvidenciaFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  selectedFile: File | null = null;
  suscripcion = new Subscription();

  formProvidencia: FormGroup;
  botonOperacion: string;

  providencia: Providencia;
  public archivos: any = [];
  datoRecuperado : any;
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private providenciaFacade: ProvidenciaFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient,
    private vistaDocumentoService : VistaDocumentoService
  ) {
    if (!this.providencia) {
      this.providencia = new Providencia();
    }

    this.formProvidencia = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.suscripcion.add(
      this.providenciaFacade.CorrespondenciaState$.subscribe(({ providencia }) => {
        if (providencia) {
          this.providencia = providencia;
          if (this.tipoOperacion === 'modificar' && this.providencia.id) {
            this.formProvidencia.setValue({
              correlativo: this.providencia.correlativo,
              referencia: this.providencia.referencia,
              providenciaPdf: this.providencia.providenciaPdf
            });
          }
        }
      })
    );
   //console.log(this.tipoOperacion);
    switch (this.tipoOperacion) {
      case 'crear':
        this.botonOperacion = 'Guardar';
        break;
      case 'modificar':
        this.botonOperacion = 'Modificar';
        break;
      case 'providencia':
        this.botonOperacion = 'Guardar';
        break;
    }

  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let providencia = new Providencia();
    //console.log(accion);
    switch (accion) {
      case 'providencia': {
        console.log(this.formProvidencia.value);
        FuncionesHelper.limpiarEspacios(this.formProvidencia);
        if (!this.formProvidencia.valid) {
          this.formProvidencia.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/providencias/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        providencia = { ...this.formProvidencia.value };
        let arr = this.router.url.split('/');
        providencia.flujo = arr[1];
        providencia.providenciaPdf = "providencia-"+this.selectedFile.name;
        this.accion.emit({
          accion: 'guardarpro',
          providencia
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formProvidencia);
        if (!this.formProvidencia.valid) {
          this.formProvidencia.markAllAsTouched();
          return;
        }
        providencia = { ...this.formProvidencia.value };
        this.accion.emit({
          accion,
          providenciaId: this.providencia.id,
          providencia
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
  buscarCorrelativo(){
    if(this.formProvidencia.get('correlativo').value !== ""){
      const body = { correlativo : this.formProvidencia.get('correlativo').value};
    this.vistaDocumentoService.buscar(body, 1, 1).subscribe(
      (datos) => {
        this.datoRecuperado = datos.lista[0];
        console.log(this.datoRecuperado);
        this.formProvidencia.patchValue({
          referencia: this.datoRecuperado.referencia
        });
      },
      (error) => {
        console.error('Error al buscar los datos:', error);
      }
    );
    }else{
      console.log("error de datos");
    }
  }

}
