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
import { Subscription } from 'rxjs';
import { DocumentoComponent } from 'src/app/modulos/correspondencia-plantilla/componentes/documento/documento.component';
import { ModoVisualizacion } from 'src/app/modulos/correspondencia-plantilla/enumeraciones/modo-visualizacion.enum';
import { Bloque } from 'src/app/modulos/correspondencia-plantilla/interfaces/bloque.interface';

import { PlantillaFacade } from '../../../fachadas/plantilla.facade';
import { Plantilla } from '../../../modelos/plantilla.model';

@Component({
  selector: 'app-correspondencia-plantilla-detalle',
  templateUrl: './plantilla-detalle.component.html',
  styles: []
})
export class PlantillaDetalleComponent implements OnInit, OnDestroy {
  @ViewChild(DocumentoComponent, { static: true })
  documento: DocumentoComponent;
  @Input() tipoOperacion: string;
  @Output() operacion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  plantilla: Plantilla;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private plantillaFacade: PlantillaFacade
  ) {
    if (!this.plantilla) {
      this.plantilla = new Plantilla();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.plantillaFacade.CorrespondenciaState$.subscribe(({ plantilla }) => {
        if (plantilla) {
          this.plantilla = plantilla;
          this.documento.inicializarBloques(
            JSON.parse(this.plantilla.estructura) as Bloque[],
            ModoVisualizacion.Presentacion
          );
        }
      })
    );
    switch (this.tipoOperacion) {
      case 'detalle':
        this.botonOperacion = null;
        break;
      case 'eliminar':
        this.botonOperacion = 'Eliminar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  onOperacion(operacion: string): void {
    switch (operacion) {
      case 'eliminar': {
        this.operacion.emit({
          tipoOperacion: operacion,
          plantillaId: this.plantilla.id
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
}
