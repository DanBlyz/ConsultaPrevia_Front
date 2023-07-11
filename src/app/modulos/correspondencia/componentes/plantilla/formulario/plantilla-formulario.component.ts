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
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { Codificador } from 'src/app/comun/modelos';

import { DocumentoComponent } from 'src/app/modulos/correspondencia-plantilla/componentes';
import { ModoVisualizacion } from 'src/app/modulos/correspondencia-plantilla/enumeraciones';
import { Bloque } from 'src/app/modulos/correspondencia-plantilla/interfaces';
import { PlantillaFacade } from '../../../fachadas';
import { TipoDocumentoFacade } from '../../../fachadas';
import { Plantilla } from '../../../modelos';

@Component({
  selector: 'app-correspondencia-plantilla-formulario',
  templateUrl: './plantilla-formulario.component.html',
  styles: []
})
export class PlantillaFormularioComponent implements OnInit, OnDestroy {
  @ViewChild(DocumentoComponent, { static: true })
  documento: DocumentoComponent;
  @Input() public tipoOperacion = 'crear';
  @Output() operacion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formPlantilla: FormGroup;
  botonOperacion: string;

  plantillaId: number;
  plantilla: Plantilla;
  listaTipoDocumentoCodificador: Codificador[];

  modoVisualizacion = ModoVisualizacion.Esquema;
  bloques: string;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private plantillaFacade: PlantillaFacade,
    private toastrService: ToastrService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.tipoOperacion = 'modificar';
        this.plantillaId = parseInt(params.get('id'), 10);
        this.plantillaFacade.obtenerPorId(this.plantillaId);
      }
    });

    if (!this.plantilla) {
      this.plantilla = new Plantilla();
    }

    this.formPlantilla = this.fb.group({
      version: [1, Validators.required],
      estructura: ['', Validators.required],
      estaActiva: [true, Validators.required],
      tipoDocumentoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.plantillaFacade.CorrespondenciaState$.subscribe(({ plantilla }) => {
        if (plantilla) {
          this.plantilla = plantilla;
          if (this.tipoOperacion === 'modificar' && this.plantilla.id) {
            this.formPlantilla.setValue({
              version: this.plantilla.version,
              estructura: JSON.stringify(
                JSON.parse(this.plantilla.estructura),
                null,
                4
              ),
              estaActiva: this.plantilla.estaActiva,
              tipoDocumentoId: this.plantilla.tipoDocumentoId
            });
            this.documento.inicializarBloques(
              this.plantilla.estructura
                ? (JSON.parse(this.plantilla.estructura) as Bloque[])
                : [],
              this.modoVisualizacion
            );
            this.documento.establecerParametros({
              tipoDocumentoId: this.plantilla.tipoDocumentoId,
              tipoDocumento: this.plantilla.tipoDocumentoNombre,
              cite: `[ENTIDAD]-[UNI-ORGANIZACIONAL]-${this.plantilla.tipoDocumentoId}-[CORRELATIVO]/[GESTION]`,
              hojaRuta: '[CORRELATIVO].[GESTION]'
            });
          }
        }
      })
    );

    this.tipoDocumentoFacade
      .obtenerCodificadorFiltrado({
        conPlantilla: true
      })
      .then((respuesta) => {
        this.listaTipoDocumentoCodificador = respuesta.lista;
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

  onOperacion(operacion: string): void {
    let plantilla = new Plantilla();
    switch (operacion) {
      case 'crear': {
        this.formPlantilla.patchValue({
          estructura: JSON.stringify(this.documento.obtenerBloques())
        });
        FuncionesHelper.limpiarEspacios(this.formPlantilla);
        if (!this.formPlantilla.valid) {
          this.formPlantilla.markAllAsTouched();
          return;
        }
        plantilla = { ...this.formPlantilla.value };
        delete plantilla.estaActiva;
        this.plantillaFacade.guardar(plantilla).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            //
          }
        });
        break;
      }
      case 'modificar': {
        this.formPlantilla.patchValue({
          estructura: JSON.stringify(this.documento.obtenerBloques())
        });
        FuncionesHelper.limpiarEspacios(this.formPlantilla);
        if (!this.formPlantilla.valid) {
          this.formPlantilla.markAllAsTouched();
          return;
        }
        plantilla = { ...this.formPlantilla.value, fecha: undefined };
        this.plantillaFacade
          .modificar(this.plantillaId, plantilla)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              //
            }
          });
        break;
      }
      case 'cancelar': {
        this.operacion.emit({
          tipoOperacion: operacion
        });
        break;
      }
    }
  }

  ejecutarAccion(evento) {
    const tipoDocumento = this.listaTipoDocumentoCodificador.find(
      (item) => item.id === evento.id
    );
    this.documento.establecerParametros({
      tipoDocumentoId: tipoDocumento.id,
      tipoDocumento: tipoDocumento.nombre,
      cite: `[ENTIDAD]-[UNI-ORGANIZACIONAL]-${tipoDocumento.id}-[CORRELATIVO]/[GESTION]`,
      hojaRuta: '[CORRELATIVO].[GESTION]'
    });
  }

  vaciarBloques(): void {
    this.documento.vaciarBloques();
  }
}
