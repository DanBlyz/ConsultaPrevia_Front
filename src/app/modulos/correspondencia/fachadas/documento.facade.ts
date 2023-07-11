import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import {
  Paginado,
  Respuesta,
  RespuestaLista,
  RespuestaObjeto
} from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';
import { usuarioAutenticadoSelector } from 'src/app/seguridad/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import {
  filtroDocumentoSelector,
  paginadoDocumentoSelector
} from '../estados/selectores';
import {
  Adjunto,
  Contenido,
  Documento,
  Seguimiento,
  Proveido,
  Archivado,
  Devolver,
  Anulado,
  DocumentoHojaRuta
} from '../modelos';
import { DocumentoFilter } from '../modelos/filtros';
import { DocumentoService, ParticipanteService } from '../servicios';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos';

@Injectable({
  providedIn: 'root'
})
export class DocumentoFacade {
  usuarioAutenticado: UsuarioAutenticado;

  filtro: DocumentoFilter = new DocumentoFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<DocumentoFilter> {
    return this.store.select(filtroDocumentoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private documentoService: DocumentoService,
    private participanteService: ParticipanteService
  ) {
    this.store.select(usuarioAutenticadoSelector).subscribe((usuario) => {
      if (usuario != null) {
        this.usuarioAutenticado = usuario;
      }
    });
    this.store.select(filtroDocumentoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoDocumentoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: DocumentoFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroDocumento({
        filtro: { ...filtro }
      })
    );
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerDocumento({
              objeto: { ...respuesta.objeto }
            })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  guardar(objeto: Documento): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  modificar(
    id: number,
    objeto: Documento
  ): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          resolve(respuesta);
        });
    });
  }

  eliminar(id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService.eliminar(id).subscribe((respuesta: Respuesta) => {
        this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        resolve(respuesta);
      });
    });
  }

  enviar(id: number, adjuntoId = null): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({
        procesando: true
      })
    );
    this.store.dispatch(
      ComunAcciones.establecerMensaje({
        mensaje: 'Generando documento PDF'
      })
    );
    return new Promise(async (resolve, reject) => {
      let archivoPdfBase64 = null;
      if (!adjuntoId) {
        const respuesta = await this.obtenerPdfBase64PorDocumentoId(id);
        archivoPdfBase64 = respuesta.objeto.archivoBase64;
      } else {
        const respuesta = await this.obtenerAdjuntoPorDocumentoId(
          id,
          adjuntoId
        );
        archivoPdfBase64 = respuesta.objeto.archivoBase64;
      }
      if (archivoPdfBase64 === null) {
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        reject(null);
      }
      this.store.dispatch(
        ComunAcciones.establecerProcesando({
          procesando: true
        })
      );
      this.store.dispatch(
        ComunAcciones.establecerMensaje({
          mensaje: 'Firmando documento PDF'
        })
      );
      try {

      } catch (error) {
        const respuesta = new Respuesta();
        respuesta.tipoRespuesta = 'Excepcion';
        respuesta.mensaje = error.response.data.message;
        this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        this.store.dispatch(ComunAcciones.limpiarMensaje());
      }
    });
  }

  aprobar(id: number, adjuntoId: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      const respuesta = await this.obtenerAdjuntoPorDocumentoId(id, adjuntoId);
      this.store.dispatch(
        ComunAcciones.establecerProcesando({ procesando: true })
      );
    });
  }

  derivar(
    id: number,
    seguimientoId: number,
    buzones: number[],
    destinatarios: string[],
    proveido: Proveido
  ): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );

    return new Promise(async (resolve) => {
    });
  }

  recibir(id: number): Promise<RespuestaObjeto<Contenido>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .recibir(id)
        .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerContenidoPorDocumentoId(id);
          }
          this.store.dispatch(
            ComunAcciones.establecerNotificacion({ respuesta })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  archivar(
    id: number,
    seguimientoId: number,
    archivado: Archivado
  ): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      this.store.dispatch(
        ComunAcciones.establecerProcesando({ procesando: true })
      );
    });
  }

  devolver(
    id: number,
    adjuntoId: number,
    devolver: Devolver,
    tipo: string
  ): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      this.store.dispatch(
        ComunAcciones.establecerProcesando({ procesando: true })
      );
    });
  }

  eliminarDocumentoAdjunto(id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      this.documentoService
        .eliminarDocumentoAdjunto(id)
        .subscribe((respuesta: Respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerPorId(id);
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  duplicar(id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      this.documentoService.duplicar(id).subscribe((respuesta: Respuesta) => {
        if (respuesta.tipoRespuesta === 'Exito') {
          this.obtenerPorId(id);
        }
        this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        resolve(respuesta);
      });
    });
  }

  anular(
    id: number,
    seguimientoId: number,
    anulado: Anulado
  ): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise(async (resolve) => {
      this.store.dispatch(
        ComunAcciones.establecerProcesando({ procesando: true })
      );
    });
  }

  archivo(objeto: DocumentoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.documentoService
      .archivo(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Documento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaDocumento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  archivoCentral(
    objeto: DocumentoFilter,
    pagina: number,
    cantidad: number
  ): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.documentoService
      .archivoCentral(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Documento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaDocumento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  // Contenido
  obtenerContenidoPorDocumentoId(
    documentoId: number
  ): Promise<RespuestaObjeto<Contenido>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerContenidoPorDocumentoId(documentoId)
        .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerContenido({
              objeto: { ...respuesta.objeto }
            })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  guardarContenido(
    documentoId: number,
    objeto: Contenido
  ): Promise<RespuestaObjeto<Contenido>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .guardarContenido(documentoId, objeto)
        .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerContenidoPorDocumentoId(documentoId);
          }
          this.store.dispatch(
            ComunAcciones.establecerNotificacion({ respuesta })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  modificarContenido(
    documentoId: number,
    objeto: Contenido
  ): Promise<RespuestaObjeto<Contenido>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .modificarContenido(documentoId, objeto)
        .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerContenidoPorDocumentoId(documentoId);
          }
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.store.dispatch(
            ComunAcciones.establecerNotificacion({ respuesta })
          );
          resolve(respuesta);
        });
    });
  }

  eliminarContenido(documentoId: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .eliminarContenido(documentoId)
        .subscribe((respuesta: Respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerContenidoPorDocumentoId(documentoId);
          }
          this.store.dispatch(
            ComunAcciones.establecerNotificacion({ respuesta })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  autoguardadoContenido(
    tipoOperacion: string,
    documentoId: number,
    objeto: Contenido
  ): Promise<RespuestaObjeto<Contenido>> {
    return new Promise((resolve) => {
      if (tipoOperacion === 'crear') {
        this.documentoService
          .guardarContenido(documentoId, objeto)
          .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
            resolve(respuesta);
          });
      } else {
        this.documentoService
          .modificarContenido(documentoId, objeto)
          .subscribe((respuesta: RespuestaObjeto<Contenido>) => {
            resolve(respuesta);
          });
      }
    });
  }

  obtenerPdfBase64PorDocumentoId(
    documentoId: number
  ): Promise<RespuestaObjeto<any>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerPdfBase64PorDocumentoId(documentoId)
        .subscribe((respuesta: RespuestaObjeto<any>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // Adjunto
  guardarAdjunto(
    documentoId: number,
    objeto: Adjunto
  ): Promise<RespuestaObjeto<Adjunto>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .guardarAdjunto(documentoId, objeto)
        .subscribe((respuesta: RespuestaObjeto<Adjunto>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerPorId(documentoId);
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  eliminarAdjunto(
    documentoId: number,
    adjuntoId: number
  ): Promise<RespuestaObjeto<Adjunto>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .eliminarAdjunto(documentoId, adjuntoId)
        .subscribe((respuesta: RespuestaObjeto<Adjunto>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerPorId(documentoId);
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  obtenerAdjuntoPorDocumentoId(
    documentoId: number,
    adjuntoId: number
  ): Promise<RespuestaObjeto<Adjunto>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerAdjuntoPorDocumentoId(documentoId, adjuntoId)
        .subscribe((respuesta: RespuestaObjeto<Adjunto>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // Seguimiento
  obtenerSeguimientoPorDocumentoId(
    documentoId: number
  ): Promise<RespuestaLista<Seguimiento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerSeguimientoPorDocumentoId(documentoId)
        .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // DocumentoHojaRuta
  obtenerDocumentoHojaRutaPorDocumentoId(
    documentoId: number
  ): Promise<RespuestaLista<DocumentoHojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerDocumentoHojaRutaPorDocumentoId(documentoId)
        .subscribe((respuesta: RespuestaLista<DocumentoHojaRuta>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  //Generar CITe y HR
  generarCiteHr(id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({
        procesando: true
      })
    );
    return new Promise(async (resolve, reject) => {
      this.store.dispatch(
        ComunAcciones.establecerProcesando({
          procesando: true
        })
      );
      try {
        this.documentoService
          .generarCiteHr(id)
          .subscribe((respuesta: Respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.obtenerPorId(id);
            }
            this.store.dispatch(
              ComunAcciones.establecerRespuesta({ respuesta })
            );
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            resolve(respuesta);
          });
      } catch (error) {
        const respuesta = new Respuesta();
        respuesta.tipoRespuesta = 'Excepcion';
        respuesta.mensaje = error.response.data.message;
        this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      }
    });
  }
}
