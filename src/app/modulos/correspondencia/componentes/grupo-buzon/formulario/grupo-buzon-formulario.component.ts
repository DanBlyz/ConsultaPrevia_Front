import { formatDate } from '@angular/common';
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

import { FuncionesHelper } from '../../../../../comun/auxiliares';
import { Codificador } from '../../../../../comun/modelos';

import { Grupo, GrupoBuzon } from '../../../modelos';
import { GrupoFacade, BuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-buzon-formulario',
  templateUrl: './grupo-buzon-formulario.component.html',
  styles: []
})
export class GrupoBuzonFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formGrupoBuzon: FormGroup;
  botonOperacion: string;

  grupo: Grupo;
  grupoBuzon: GrupoBuzon;
  listaBuzonPuestoCodificador: Codificador[];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private grupoFacade: GrupoFacade,
    private buzonFacade: BuzonFacade,
    private toastrService: ToastrService
  ) {
    if (!this.grupoBuzon) {
      this.grupoBuzon = new GrupoBuzon();
    }

    this.formGrupoBuzon = this.fb.group({
      fecInicio: ['', Validators.required],
      fecConclusion: [''],
      estado: ['ACTIVO', Validators.required],
      grupoId: ['', Validators.required],
      buzonId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(({ grupo }) => {
        if (grupo) {
          this.grupo = grupo;
          this.formGrupoBuzon.controls['grupoId'].setValue(this.grupo.id);
          //this.formGrupoBuzon.controls['buzonId'].setValue(this.grupo.buzonId);
        }
      })
    );

    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(({ grupoBuzon }) => {
        if (grupoBuzon) {
          this.grupoBuzon = grupoBuzon;
          if (this.tipoOperacion === 'modificar' && this.grupoBuzon.id) {
            this.formGrupoBuzon.setValue({
              fecInicio: formatDate(
                this.grupoBuzon.fecInicio,
                'yyyy-MM-dd',
                this.locale,
                'UTC'
              ),
              fecConclusion: this.grupoBuzon.fecConclusion
                ? formatDate(
                    this.grupoBuzon.fecConclusion,
                    'yyyy-MM-dd',
                    this.locale,
                    'UTC'
                  )
                : '',
              estado: this.grupoBuzon.estado,
              grupoId: this.grupoBuzon.grupoId,
              buzonId: this.grupoBuzon.buzonId
            });
          }
        }
      })
    );

    this.buzonFacade.obtenerCodificador().then((respuesta) => {
      if (respuesta.tipoRespuesta === 'Exito') {
        this.listaBuzonPuestoCodificador = respuesta.lista;
      }
    });

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

  /*ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }*/

  ejecutarAccion(accion: string): void {
    let grupoBuzon = new GrupoBuzon();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formGrupoBuzon);
        if (this.formGrupoBuzon.controls['fecConclusion'].value === '') {
          this.formGrupoBuzon.controls['fecConclusion'].setValue(null);
        }
        if (!this.formGrupoBuzon.valid) {
          this.formGrupoBuzon.markAllAsTouched();
          return;
        }
        grupoBuzon = {
          ...this.formGrupoBuzon.value
        };
        delete grupoBuzon.estado;
        this.accion.emit({
          accion: 'guardar',
          grupoId: this.grupo.id,
          grupoBuzon
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formGrupoBuzon);
        if (this.formGrupoBuzon.controls['fecConclusion'].value === '') {
          this.formGrupoBuzon.controls['fecConclusion'].setValue(null);
        }
        if (!this.formGrupoBuzon.valid) {
          this.formGrupoBuzon.markAllAsTouched();
          return;
        }
        grupoBuzon = {
          ...this.formGrupoBuzon.value
        };
        this.accion.emit({
          accion,
          grupoId: this.grupo.id,
          grupoBuzonId: this.grupoBuzon.id,
          grupoBuzon
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
