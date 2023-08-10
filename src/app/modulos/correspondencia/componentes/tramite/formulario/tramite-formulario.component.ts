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
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';

import { Tramite } from '../../../modelos';
import { TramiteFacade } from '../../../fachadas';
import { VistaHojaRutaService } from '../../../servicios';
import { VistaAreaMineraService } from '../../../servicios';
import { Observable } from 'tinymce';

@Component({
  selector: 'app-correspondencia-tramite-formulario',
  templateUrl: './tramite-formulario.component.html',
  styles: []
})
export class TramiteFormularioComponent implements OnInit, OnDestroy {
  public keyword = 'nombre';
  public listaHoja$: Observable<any[]>;
  selectedItem: any;
  correlativo : string;

  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formTramite: FormGroup;
  botonOperacion: string;

  tramite: Tramite;
  listaHojaRuta : any[] = [];
  datoRecuperado : any;
 
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private tramiteFacade: TramiteFacade,
    private toastrService: ToastrService,
    private vistaHojaRutaService : VistaHojaRutaService,
    private vistaAreaMineraService : VistaAreaMineraService
  ) {
    if (!this.tramite) {
      this.tramite = new Tramite();
    }

    this.formTramite = this.fb.group({
      correlativo: ['', Validators.required],
      codigoUnico: [0, Validators.required],
      areaMinera: ['', Validators.required],
      clasificacion: ['', Validators.required],
      nroCuadricula: [0, Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      municipio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.hojadeRutaBuscar();
    this.suscripcion.add(
      this.tramiteFacade.CorrespondenciaState$.subscribe(({ tramite }) => {
        if (tramite) {
          this.tramite = tramite;
          if (this.tipoOperacion === 'modificar' && this.tramite.id) {
            this.formTramite.setValue({
              correlativo: this.tramite.correlativo,
              codigoUnico: this.tramite.codigoUnico,
              areaMinera: this.tramite.areaMinera,
              clasificacion: this.tramite.clasificacion,
              departamento: this.tramite.departamento,
              provincia: this.tramite.provincia,
              municipio: this.tramite.municipio,
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
    let tramite = new Tramite();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formTramite);
        if (!this.formTramite.valid) {
          this.formTramite.markAllAsTouched();
          return;
        }
        tramite = { ...this.formTramite.value };
        tramite.estado = 'PENDIENTE';
        tramite.correlativo = this.correlativo;
        tramite.estadoAccion = 'INICIO';
        this.accion.emit({
          accion: 'guardar',
          tramite
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formTramite);
        if (!this.formTramite.valid) {
          this.formTramite.markAllAsTouched();
          return;
        }
        tramite = { ...this.formTramite.value };
        this.accion.emit({
          accion,
          tramiteId: this.tramite.id,
          tramite
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
  hojadeRutaBuscar(){
    const body = { };
    this.vistaHojaRutaService.obtenerCodificador().subscribe(
      (datos) => {
        this.listaHojaRuta = datos.lista;
        console.log(this.listaHojaRuta);      
      },
      (error) => {
        console.error('Error al buscar los datos:', error);
      }
    );
    
  }
  buscarAreaMinera(){
    if(this.formTramite.get('areaMinera').value !== ""){
      const body = { nombre : this.formTramite.get('areaMinera').value};
    this.vistaAreaMineraService.buscar(body, 1, 1).subscribe(
      (datos) => {
        this.datoRecuperado = datos.lista[0];
        console.log(this.datoRecuperado);
        this.formTramite.patchValue({
          codigoUnico: Number(this.datoRecuperado.codigo_unico),
          nroCuadricula: Number(this.datoRecuperado.cuadriculas_solicitadas),
          departamento: this.datoRecuperado.departamentos,
          provincia: this.datoRecuperado.provincias,
          municipio: this.datoRecuperado.municipios,
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
  onItemSelected(item: any) {
    this.correlativo = item.nombre;
  }
  onChangeSearch ( val :string )  { 
    this.correlativo = val;
  } 
  selectEvent(item) {
    this.correlativo = item.nombre;
  }
}
