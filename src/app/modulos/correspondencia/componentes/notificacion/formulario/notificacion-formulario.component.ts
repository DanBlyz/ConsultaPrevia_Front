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
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';
import { FuncionesHelper } from 'src/app/comun/auxiliares';

import { Informe, Notificacion, SujetoIdentificado } from '../../../modelos';
import { NotificacionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { InformeFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-notificacion-formulario',
  templateUrl: './notificacion-formulario.component.html',
  styles: []
})
export class NotificacionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;
  informe: Informe = new Informe();
  selectedFile: File | null = null;
  selectedCheckbox: string | null = null;
  items: Informe [] = [];
  sujetos: SujetoIdentificado [] = [];
  arr = this.router.url.split('/');
  @Input() public informeCorrelativo: any;
  datoRecibido: any;

  suscripcion = new Subscription();
  formNotificacion: FormGroup;
  botonOperacion: string;

  notificacion: Notificacion;
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private notificacionFacade: NotificacionFacade,
    private toastrService: ToastrService,
    private router : Router,
    private http: HttpClient,
    private informeFacade: InformeFacade
  ) {
    if (!this.notificacion) {
      this.notificacion = new Notificacion();
    }

    this.formNotificacion = this.fb.group({
      notificado: ['', Validators.required],
      direccionDpto: ['', Validators.required],
      representanteMinero: [true,Validators.required],
      representanteComunidad: [false,Validators.required],
      sifde: [false,Validators.required],
      comunidad: ['']
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.notificacionFacade.CorrespondenciaState$.subscribe(({ notificacion }) => {
        if (notificacion) {
          this.notificacion = notificacion;
          if (this.tipoOperacion === 'modificar' && this.notificacion.id) {
            this.formNotificacion.setValue({
              notificado: this.notificacion.notificado,
              direccionDpto: this.notificacion.direccionDpto,
              representanteMinero: this.notificacion.representanteMinero,
              representanteComunidad: this.notificacion.representanteComunidad,
              sifde: this.notificacion.sifde,
              comunidad: this.notificacion.comunidad || ''
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
      case 'notificacion':
        this.botonOperacion = 'Guardar';
        break;
    }
    this.ObtenerSujetosporInforme(this.informeCorrelativo);
    console.log(this.informeCorrelativo+" noti")
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let notificacion = new Notificacion();
    switch (accion) {
      case 'notificacion': {
        FuncionesHelper.limpiarEspacios(this.formNotificacion);
        if (!this.formNotificacion.valid) {
          this.formNotificacion.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/notificaciones/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        notificacion = { ...this.formNotificacion.value };
        console.log(this.router.url);
        let arr = this.router.url.split('/');
        notificacion.flujo = arr[1];
        notificacion.notificacionPdf = "notificacion-"+this.selectedFile.name;
        this.accion.emit({
          accion: 'guardarnoti',
          notificacion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formNotificacion);
        if (!this.formNotificacion.valid) {
          this.formNotificacion.markAllAsTouched();
          return;
        }
        notificacion = { ...this.formNotificacion.value };
        this.accion.emit({
          accion,
          notificacionId: this.notificacion.id,
          notificacion
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

  ObtenerSujetosporInforme(informe: string) {
    const body = { correlativo: informe }; // Aquí defines los parámetros que necesitas enviar en el body
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(body.correlativo+" correltaito");
    // Realizar la solicitud HTTP POST con los parámetros en el body
    this.http.post<any>('http://localhost:3000/documentos/buscar', body, { headers }).subscribe(
      (response) => {
        this.sujetos = response.lista[0].listaSujetoIdentificado; // Almacenar los datos en la variable items
        console.log(response.lista);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  onCheckboxChange(checkboxName: string) {
    if (this.selectedCheckbox === checkboxName) {
      // Si el checkbox seleccionado ya está marcado, desmárcalo
      this.formNotificacion.get(checkboxName)?.setValue(false);
      this.selectedCheckbox = null;
    } else {
      // Marca el checkbox seleccionado y desmarca los otros
      this.selectedCheckbox = checkboxName;
      Object.keys(this.formNotificacion.controls).forEach((name) => {
        if (name !== checkboxName && name !== 'notificado' && name !== 'direccionDpto' && name !== 'comunidad') {
          console.log(name);
          this.formNotificacion.get(name)?.setValue(false);
        }
      });
    }
  }
  recibirDato(dato: any) {
    this.datoRecibido = dato;
    
   }
}
