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

import { Documento, SujetoIdentificado } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';
import { VistaDocumentoService } from '../../../servicios';

@Component({
  selector: 'app-correspondencia-documento-formulario',
  templateUrl: './documento-formulario.component.html',
  styles: []
})
export class DocumentoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  
  selectedFile: File | null = null;
  listaSujetoIdentificado: SujetoIdentificado []= [];
  listaSujetosIdentificados: any[] = [];

  suscripcion = new Subscription();

  formDocumento: FormGroup;
  botonOperacion: string;

  arr = this.router.url.split('/');
  documento: Documento;
  datoRecuperado : any;
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private documentoFacade: DocumentoFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient,
    private vistaDocumentoService: VistaDocumentoService
  ) {
    if (!this.documento) {
      this.documento = new Documento();
    }

    this.formDocumento = this.fb.group({
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
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          this.documento = documento;
          if (this.tipoOperacion === 'modificar' && this.documento.id) {
            this.formDocumento.setValue({
              correlativo: this.documento.correlativo,
              referencia: this.documento.referencia,
              asunto: this.documento.tipoDocumento,
              documentoPdf: this.documento.documentoPdf,
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
      case 'documentoReprogramacion':
        this.botonOperacion = 'Guardar';
        break;
      case 'documentoDeliberacion':
        this.botonOperacion = 'Guardar';
        break;
      case 'documento':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let documento = new Documento();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        console.log(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        documento = { ...this.formDocumento.value };
        this.accion.emit({
          accion: 'guardar',
          documento
        });
        break;
      }
      case 'documento': {
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        console.log(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        documento = { ...this.formDocumento.value };
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile,documento.tipoDocumento+"-"+this.selectedFile.name);
        this.http.post<any>('http://localhost:3000/documentos/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        documento.documentoPdf = documento.tipoDocumento+"-"+this.selectedFile.name;
       
          if(documento.tipoDocumento === 'Informe Social'){
            for (let i = 0; i < this.formDocumento.value.nroSujetos; i++) {
              const sujeto = new SujetoIdentificado();
              sujeto.comunidad = this.formDocumento.value['comunidad' + (i + 1)];
              sujeto.autoridad = this.formDocumento.value['autoridad' + (i + 1)];
              sujeto.telefono = this.formDocumento.value['telefono' + (i + 1)];
              console.log(sujeto+ "sujeto ident");
              this.listaSujetoIdentificado.push(sujeto);
            }
            documento.listaSujetoIdentificado = this.listaSujetoIdentificado;
          }
        
        let arr = this.router.url.split('/');
        documento.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarDocumento',
          documento
        });
        break;
      }
      case 'documentoReprogramacion': {
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        console.log(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        documento = { ...this.formDocumento.value };
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile,documento.tipoDocumento+"-"+this.selectedFile.name);
        this.http.post<any>('http://localhost:3000/documentos/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        documento.documentoPdf = documento.tipoDocumento+"-"+this.selectedFile.name;
        let arr = this.router.url.split('/');
        documento.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarDocumentoReprogramacion',
          documento
        });
        break;
      }
      case 'documentoDeliberacion': {
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        documento = { ...this.formDocumento.value };
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile,documento.tipoDocumento+"-"+this.selectedFile.name);
        this.http.post<any>('http://localhost:3000/documentos/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        documento.documentoPdf = documento.tipoDocumento+"-"+this.selectedFile.name;
        let arr = this.router.url.split('/');
        documento.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarDocumentoDeliberacion',
          documento
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        documento = { ...this.formDocumento.value };
        this.accion.emit({
          accion,
          documentoId: this.documento.id,
          documento
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
    if(this.formDocumento.get('correlativo').value !== ""){
      const body = { correlativo : this.formDocumento.get('correlativo').value};
    this.vistaDocumentoService.buscar(body, 1, 1).subscribe(
      (datos) => {
        this.datoRecuperado = datos.lista[0];
        console.log(this.datoRecuperado);
        this.formDocumento.patchValue({
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
