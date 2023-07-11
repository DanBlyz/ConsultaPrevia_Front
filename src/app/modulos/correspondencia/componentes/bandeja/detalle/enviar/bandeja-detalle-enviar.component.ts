import {
  Component,
  HostListener,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ModoVisualizacion } from '../../../../../correspondencia-plantilla/enumeraciones';
import { DocumentoFacade, SeguimientoFacade } from '../../../../fachadas';
import { Documento } from '../../../../modelos';
import { ContenidoFormularioComponent } from '../../../contenido';

@Component({
  selector: 'app-correspondencia-bandeja-detalle-enviar',
  templateUrl: './bandeja-detalle-enviar.component.html',
  styles: []
})
export class BandejaDetalleEnviarComponent implements OnInit, OnDestroy {
  @ViewChild('contenido') contenido: ContenidoFormularioComponent;

  suscripcion = new Subscription();

  modoVisualizacion = ModoVisualizacion.Registro;

  seguimientoId: number;
  // documentoId: number;
  documento: Documento;

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
          .then(async (respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              const respuestaDocumento =
                await this.documentoFacade.obtenerPorId(
                  respuesta.objeto.documentoId
                );
              this.documento = respuestaDocumento.objeto;
              this.documentoFacade.obtenerContenidoPorDocumentoId(
                respuesta.objeto.documentoId
              );
            }
          });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        async ({ documento }) => {
          if (documento && this.documento !== documento) {
            this.documento = documento;
            if (!this.documento.esBorrador) {
              this.modoVisualizacion = ModoVisualizacion.Documento;
            }
          }
        }
      )
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    //
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'recargar-y-guardar-contenido': {
        await this.documentoFacade.obtenerPorId(this.documento.id);
        this.contenido.actualizarPropiedades();
        await this.contenido.autoguardado();
        break;
      }
      case 'guardar-contenido': {
        await this.contenido.autoguardado();
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }
}
