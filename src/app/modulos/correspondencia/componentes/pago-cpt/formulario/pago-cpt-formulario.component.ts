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

import { PagoCpt } from '../../../modelos';
import { PagoCptFacade } from '../../../fachadas';
import { Router } from '@angular/router';
@Component({
  selector: 'app-correspondencia-pago-cpt-formulario',
  templateUrl: './pago-cpt-formulario.component.html',
  styles: []
})
export class PagoCptFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formPagoCpt: FormGroup;
  botonOperacion: string;

  pagoCpt: PagoCpt;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private pagoCptFacade: PagoCptFacade,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (!this.pagoCpt) {
      this.pagoCpt = new PagoCpt();
    }

    this.formPagoCpt = this.fb.group({
      pagoRealizado: [false, Validators.required],
      diasViaje: [0, Validators.required],
      tipoViaje: ['', Validators.required],
      montoTotal: [0],
      apm: ['', Validators.required],
      descripcion: ['',Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.pagoCptFacade.CorrespondenciaState$.subscribe(({ pagoCpt }) => {
        if (pagoCpt) {
          this.pagoCpt = pagoCpt;
          if (this.tipoOperacion === 'modificar' && this.pagoCpt.id) {
            this.formPagoCpt.setValue({
              pagoRealizado: this.pagoCpt.pagoRealizado,
              diasViaje: this.pagoCpt.diasViaje,
              tipoViaje: this.pagoCpt.tipoViaje,
              montoTotal: this.pagoCpt.montoTotal,
              apm: this.pagoCpt.apm,
              descripcion: this.pagoCpt.descripcion
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
      case 'pagoCpt':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let pagoCpt = new PagoCpt();
    console.log(accion);
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formPagoCpt);
        if (!this.formPagoCpt.valid) {
          this.formPagoCpt.markAllAsTouched();
          return;
        }
        pagoCpt = { ...this.formPagoCpt.value };
        let arr = this.router.url.split('/');
        pagoCpt.flujo = arr[1];
        pagoCpt.montoTotal = this.calculateMontoTotal();
        console.log(pagoCpt);
        this.accion.emit({
          accion: 'guardar',
          pagoCpt
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formPagoCpt);
        if (!this.formPagoCpt.valid) {
          this.formPagoCpt.markAllAsTouched();
          return;
        }
        pagoCpt = { ...this.formPagoCpt.value };
        this.accion.emit({
          accion,
          pagoCptId: this.pagoCpt.id,
          pagoCpt
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
      case 'pagoCpt': {
        FuncionesHelper.limpiarEspacios(this.formPagoCpt);
        if (!this.formPagoCpt.valid) {
          this.formPagoCpt.markAllAsTouched();
          return;
        }
        pagoCpt = { ...this.formPagoCpt.value };
        let arr = this.router.url.split('/');
        pagoCpt.flujo = arr[1];
        pagoCpt.montoTotal = this.calculateMontoTotal();
        pagoCpt.estado = 'EN PROCESO';
        this.accion.emit({
          accion: 'guardaPagoCpt',
          pagoCpt
        });
        break;
      }
    }
  }
 calculateMontoTotal(): number {
    const tipoViajeValue = this.formPagoCpt.get('tipoViaje').value;
    const diasViajeValue = this.formPagoCpt.get('diasViaje').value;

    // Lógica para calcular el montoTotal basado en tipoViaje y diasViaje
    if (tipoViajeValue === 'Interdepartamental') {
      return Math.round(diasViajeValue * 371);
    } else if (tipoViajeValue === 'Intradepartamental') {
      return Math.round(diasViajeValue * 222);
    } else if (tipoViajeValue === 'Franja de Frontera') {
      return Math.round(diasViajeValue * 391);
    } else {
      return 0;
    }
  }
  
}
