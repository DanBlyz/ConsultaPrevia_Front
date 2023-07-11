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

import { ModoVisualizacion } from '../../../../correspondencia-plantilla/enumeraciones';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-documento-archivo-detalle',
  templateUrl: './documento-archivo-detalle.component.html',
  styles: []
})
export class DocumentoArchivoDetalleComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  modoVisualizacion = ModoVisualizacion.Documento;

  documentoId: number;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private activatedRoute: ActivatedRoute,
    private documentoFacade: DocumentoFacade,
    private toastrService: ToastrService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.documentoId = parseInt(params.get('id'), 10);
        this.documentoFacade.obtenerPorId(this.documentoId);
        this.documentoFacade.obtenerContenidoPorDocumentoId(this.documentoId);
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
