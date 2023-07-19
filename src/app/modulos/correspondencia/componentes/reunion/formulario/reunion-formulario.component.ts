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

import { Reunion } from '../../../modelos';
import { ReunionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-reunion-formulario',
  templateUrl: './reunion-formulario.component.html',
  styles: []
})
export class ReunionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formReunion: FormGroup;
  botonOperacion: string;

  reunion: Reunion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private reunionFacade: ReunionFacade,
    private toastrService: ToastrService
  ) {
    if (!this.reunion) {
      this.reunion = new Reunion();
    }

    this.formReunion = this.fb.group({
      nroReunion: ['', Validators.required],
      acuerdo: ['', Validators.required],
      motivo: ['', Validators.required],
      reunionRealizada: ['', Validators.required],
      actaReunionPdf: ['', Validators.required],
      encargado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.reunionFacade.CorrespondenciaState$.subscribe(({ reunion }) => {
        if (reunion) {
          this.reunion = reunion;
          if (this.tipoOperacion === 'modificar' && this.reunion.id) {
            this.formReunion.setValue({
              nroReunion: this.reunion.nroReunion,
              acuerdo: this.reunion.acuerdo,
              motivo: this.reunion.motivo,
              reunionRealizada: this.reunion.reunionRealizada,
              actaReunionPdf: this.reunion.actaReunionPdf,
              encargado: this.reunion.encargado,
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
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let reunion = new Reunion();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formReunion);
        if (!this.formReunion.valid) {
          this.formReunion.markAllAsTouched();
          return;
        }
        reunion = { ...this.formReunion.value };
        this.accion.emit({
          accion: 'guardar',
          reunion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formReunion);
        if (!this.formReunion.valid) {
          this.formReunion.markAllAsTouched();
          return;
        }
        reunion = { ...this.formReunion.value };
        this.accion.emit({
          accion,
          reunionId: this.reunion.id,
          reunion
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
