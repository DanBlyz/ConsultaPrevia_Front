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

import { Viaje } from '../../../modelos';
import { ViajeFacade } from '../../../fachadas';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-correspondencia-viaje-formulario',
  templateUrl: './viaje-formulario.component.html',
  styles: []
})
export class ViajeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  selectedFile: File | null = null;

  suscripcion = new Subscription();

  formViaje: FormGroup;
  botonOperacion: string;

  viaje: Viaje;
  
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private viajeFacade: ViajeFacade,
    private toastrService: ToastrService,
    private http: HttpClient
  ) {
    if (!this.viaje) {
      this.viaje = new Viaje();
    }

    this.formViaje = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: ['', Validators.required],
      nroFormulario: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.viajeFacade.CorrespondenciaState$.subscribe(({ viaje }) => {
        if (viaje) {
          this.viaje = viaje;
          if (this.tipoOperacion === 'modificar' && this.viaje.id) {
            this.formViaje.setValue({
              fechaInicio: this.viaje.fechaInicio,
              fechaFin: this.viaje.fechaFin,
              descripcion: this.viaje.descripcion,
              nroFormulario: this.viaje.nroFormulario
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
      case 'viaje':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let viaje = new Viaje();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formViaje);
        if (!this.formViaje.valid) {
          this.formViaje.markAllAsTouched();
          return;
        }
        viaje = { ...this.formViaje.value };
        console.log(viaje.fechaInicio);
        this.accion.emit({
          accion: 'guardar',
          viaje
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formViaje);
        if (!this.formViaje.valid) {
          this.formViaje.markAllAsTouched();
          return;
        }
        viaje = { ...this.formViaje.value };
        this.accion.emit({
          accion,
          viajeId: this.viaje.id,
          viaje
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
      case 'viaje': {
        FuncionesHelper.limpiarEspacios(this.formViaje);
        if (!this.formViaje.valid) {
          this.formViaje.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
    
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/viajes/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        viaje = { ...this.formViaje.value };
        viaje.formularioPdf = "viaje-"+this.selectedFile.name;
        this.accion.emit({
          accion: 'guardarViaje',
          viaje
        });
        break;
      }
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
