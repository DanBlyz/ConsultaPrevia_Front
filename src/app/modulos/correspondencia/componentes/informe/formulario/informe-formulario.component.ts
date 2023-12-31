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

import { Informe, SujetoIdentificado } from '../../../modelos';
import { InformeFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';
import { VistaDocumentoService } from '../../../servicios';

@Component({
  selector: 'app-correspondencia-informe-formulario',
  templateUrl: './informe-formulario.component.html',
  styles: []
})
export class InformeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  
  selectedFile: File | null = null;
  listaSujetoIdentificado: SujetoIdentificado []= [];
  listaSujetosIdentificados: any[] = [];

  suscripcion = new Subscription();

  formInforme: FormGroup;
  botonOperacion: string;

  arr = this.router.url.split('/');
  informe: Informe;
  datoRecuperado : any;
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private informeFacade: InformeFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient,
    private vistaDocumentoService: VistaDocumentoService
  ) {
    if (!this.informe) {
      this.informe = new Informe();
    }

    this.formInforme = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      nroSujetos: [1, Validators.required],
      comunidad1: ['_', Validators.required],
      autoridad1: ['_', Validators.required],
      telefono1: [0, Validators.required],
      comunidad2: ['_', Validators.required],
      autoridad2: ['_', Validators.required],
      telefono2: [0, Validators.required],
      comunidad3: ['_', Validators.required],
      autoridad3: ['_', Validators.required],
      telefono3: [0, Validators.required],
      comunidad4: ['_', Validators.required],
      autoridad4: ['_', Validators.required],
      telefono4: [0, Validators.required],
      comunidad5: ['_', Validators.required],
      autoridad5: ['_', Validators.required],
      telefono5: [0, Validators.required],
      comunidad6: ['_', Validators.required],
      autoridad6: ['_', Validators.required],
      telefono6: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.informeFacade.CorrespondenciaState$.subscribe(({ informe }) => {
        if (informe) {
          this.informe = informe;
          if (this.tipoOperacion === 'modificar' && this.informe.id) {
            this.formInforme.setValue({
              correlativo: this.informe.correlativo,
              referencia: this.informe.referencia,
              asunto: this.informe.tipoDocumento,
              informePdf: this.informe.informePdf,
              nroSujetos: 1,
              comunidad1: "",
              autoridad1: "",
              telefono1: 0,
              comunidad2: "",
              autoridad2: "",
              telefono2: 0,
              comunidad3: "",
              autoridad3: "",
              telefono3: 0,
              comunidad4: "",
              autoridad4: "",
              telefono4: 0,
              comunidad5: "",
              autoridad5: "",
              telefono5: 0,
              comunidad6: "",
              autoridad6: "",
              telefono6: 0
            });
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
      case 'informe':
        this.botonOperacion = 'Guardar';
        break;
      case 'documentoDeliberacion':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let informe = new Informe();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        this.accion.emit({
          accion: 'guardar',
          informe
        });
        break;
      }
      case 'informe': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/informes/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        informe = { ...this.formInforme.value };
        informe.informePdf = "informe-"+this.selectedFile.name;
       
        for (let i = 0; i < this.formInforme.value.nroSujetos; i++) {
          const sujeto = new SujetoIdentificado();
          sujeto.comunidad = this.formInforme.value['comunidad' + (i + 1)];
          sujeto.autoridad = this.formInforme.value['autoridad' + (i + 1)];
          sujeto.telefono = this.formInforme.value['telefono' + (i + 1)];
          this.listaSujetoIdentificado.push(sujeto);
        }
        informe.listaSujetoIdentificado = this.listaSujetoIdentificado;
        
        let arr = this.router.url.split('/');
        informe.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarInforme',
          informe
        });
        break;
      }
      case 'documentoDeliberacion': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/informes/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        informe = { ...this.formInforme.value };
        let arr = this.router.url.split('/');
        informe.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarInforme',
          informe
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        this.accion.emit({
          accion,
          informeId: this.informe.id,
          informe
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
    if(this.formInforme.get('correlativo').value !== ""){
      const body = { correlativo : this.formInforme.get('correlativo').value};
    this.vistaDocumentoService.buscar(body, 1, 1).subscribe(
      (datos) => {
        this.datoRecuperado = datos.lista[0];
        console.log(this.datoRecuperado);
        this.formInforme.patchValue({
          referencia: this.datoRecuperado.referencia,
          tipoDocumento: this.datoRecuperado.tipoDocumento.nombre
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
  generateRange(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index);
  }
}
