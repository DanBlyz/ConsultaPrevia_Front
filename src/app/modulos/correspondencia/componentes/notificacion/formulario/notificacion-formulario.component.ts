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

import { Notificacion } from '../../../modelos';
import { NotificacionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-correspondencia-notificacion-formulario',
  templateUrl: './notificacion-formulario.component.html',
  styles: []
})
export class NotificacionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  selectedFile: File | null = null;

  suscripcion = new Subscription();

  formNotificacion: FormGroup;
  botonOperacion: string;

  notificacion: Notificacion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private notificacionFacade: NotificacionFacade,
    private toastrService: ToastrService,
    private router : Router,
    private http: HttpClient
  ) {
    if (!this.notificacion) {
      this.notificacion = new Notificacion();
    }

    this.formNotificacion = this.fb.group({
      notificado: ['', Validators.required],
      direccionDpto: ['', Validators.required]
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
              direccionDpto: this.notificacion.direccionDpto
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
  }
}
