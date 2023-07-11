import {
  Component,
  HostListener,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ModoVisualizacion } from '../../../../../correspondencia-plantilla/enumeraciones';
import { DocumentoFacade, SeguimientoFacade } from '../../../../fachadas';

@Component({
  selector: 'app-correspondencia-bandeja-detalle-derivar',
  templateUrl: './bandeja-detalle-derivar.component.html',
  styles: []
})
export class BandejaDetalleDerivarComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  modoVisualizacion = ModoVisualizacion.Documento;

  seguimientoId: number;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private activatedRoute: ActivatedRoute,
    private seguimientoFacade: SeguimientoFacade,
    private documentoFacade: DocumentoFacade,
    private toastrService: ToastrService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.seguimientoId = parseInt(params.get('id'), 10);
        this.seguimientoFacade
          .obtenerPorId(this.seguimientoId)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.documentoFacade.obtenerPorId(respuesta.objeto.documentoId);
              this.documentoFacade.obtenerContenidoPorDocumentoId(
                respuesta.objeto.documentoId
              );
            }
          });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    //
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    //
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }
}
