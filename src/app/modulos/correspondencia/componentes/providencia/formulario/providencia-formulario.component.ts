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

@Component({
  selector: 'app-correspondencia-providencia-formulario',
  templateUrl: './providencia-formulario.component.html',
  styles: []
})
export class ProvidenciaFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formProvidencia: FormGroup;
  botonOperacion: string;

  providencia: Providencia;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private providenciaFacade: ProvidenciaFacade,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (!this.providencia) {
      this.providencia = new Providencia();
    }

    this.formProvidencia = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
      providenciaPdf: ['', Validators.required]
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
   console.log(this.tipoOperacion);
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
    console.log(accion);
    switch (accion) {
      case 'providencia': {
        FuncionesHelper.limpiarEspacios(this.formProvidencia);
        if (!this.formProvidencia.valid) {
          this.formProvidencia.markAllAsTouched();
          return;
        }
        providencia = { ...this.formProvidencia.value };
        let arr = this.router.url.split('/');
        providencia.flujo = arr[1];
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
}
