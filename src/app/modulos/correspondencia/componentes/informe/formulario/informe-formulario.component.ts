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

@Component({
  selector: 'app-correspondencia-informe-formulario',
  templateUrl: './informe-formulario.component.html',
  styles: []
})
export class InformeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  listaSujetoIdentificado: SujetoIdentificado []= [];

  suscripcion = new Subscription();

  formInforme: FormGroup;
  botonOperacion: string;

  informe: Informe;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private informeFacade: InformeFacade,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (!this.informe) {
      this.informe = new Informe();
    }

    this.formInforme = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
      asunto: ['', Validators.required],
      encargado: ['', Validators.required],
      nroSujetos: ['', Validators.required],
      comunidad: ['', Validators.required],
      representante: ['', Validators.required],
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
              asunto: this.informe.asunto,
              encargado: this.informe.encargado,
              nroSujetos: 1,
              comunidad: "",
              representante: ""
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
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let informe = new Informe();
    console.log(accion+" ejhecutar accion");
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        const sujeto = new SujetoIdentificado();
        sujeto.comunidad = this.formInforme.value.comunidad;
        sujeto.representante = this.formInforme.value.representante;
        this.listaSujetoIdentificado[0] = sujeto;
        informe.listaSujetoIdentificado = this.listaSujetoIdentificado;
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
        informe = { ...this.formInforme.value };
        const sujeto = new SujetoIdentificado();
        sujeto.comunidad = this.formInforme.value.comunidad;
        sujeto.representante = this.formInforme.value.representante;
        this.listaSujetoIdentificado[0] = sujeto;
        informe.listaSujetoIdentificado = this.listaSujetoIdentificado;
        console.log(this.router.url);
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
}
