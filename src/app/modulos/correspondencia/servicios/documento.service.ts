import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { ServicioMetodosBaseService } from 'src/app/comun/servicios/servicio-metodos-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'documentos';
  }

  enviar(id: number, pdfBase64Firmado: string): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/enviar`;
    const body = JSON.stringify({ pdfBase64Firmado });
    return this.http.post(url, body, { headers: this.headers });
  }

  aprobar(id: number, pdfBase64Firmado: string): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/aprobar`;
    const body = JSON.stringify({ pdfBase64Firmado });
    return this.http.post(url, body, { headers: this.headers });
  }

  recibir(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/recibir`;
    return this.http.post(url, {}, { headers: this.headers });
  }

  derivar(
    id: number,
    jsonBase64Firmado: string,
    seguimientoId: number,
    buzones: number[],
    destinatarios: string[],
    acciones: string[],
    instruccion: string
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/derivar`;
    const body = JSON.stringify({
      pdfBase64Firmado: jsonBase64Firmado,
      proveidoContenido: instruccion,
      accionesContenido: acciones.join(','),
      participantes: buzones.map((item) => item.toString()).join(','),
      nombresParticipantes: destinatarios.join(','),
      idSeguimiento: seguimientoId
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  archivar(
    id: number,
    jsonBase64Firmado: string,
    observacion: string,
    seguimientoId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/archivar`;
    const body = JSON.stringify({
      pdfBase64Firmado: jsonBase64Firmado,
      observacion,
      idSeguimiento: seguimientoId
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  devolver(
    id: number,
    pdfBase64Firmado: string,
    aclaracionDevolucion: string,
    tipo: string
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/devolver`;
    const body = JSON.stringify({
      pdfBase64Firmado,
      aclaracionDevolucion,
      tipo
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  eliminarDocumentoAdjunto(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/documento-adjunto`;
    return this.http.delete(url, { headers: this.headers });
  }

  duplicar(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/duplicar`;
    return this.http.post(url, {}, { headers: this.headers });
  }

  anular(
    id: number,
    jsonBase64Firmado: string,
    observacion: string,
    seguimientoId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/anular`;
    const body = JSON.stringify({
      pdfBase64Firmado: jsonBase64Firmado,
      observacion,
      idSeguimiento: seguimientoId
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  archivo(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/archivo`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  archivoCentral(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/archivo-central`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  // Contenido
  obtenerContenidoPorDocumentoId(documentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/contenidos`;
    return this.http.get(url, { headers: this.headers });
  }

  guardarContenido(documentoId: number, objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/contenidos`;
    const body = JSON.stringify(objeto);
    return this.http.post(url, body, { headers: this.headers });
  }

  modificarContenido(documentoId: number, objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/contenidos`;
    const body = JSON.stringify(objeto);
    return this.http.patch(url, body, { headers: this.headers });
  }

  eliminarContenido(documentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/contenidos`;
    return this.http.delete(url, { headers: this.headers });
  }

  obtenerPdfBase64PorDocumentoId(documentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/contenidos/pdf-base64`;
    return this.http.get(url, { headers: this.headers });
  }

  // Adjunto
  guardarAdjunto(documentoId: number, objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/adjuntos`;
    const body = JSON.stringify(objeto);
    return this.http.post(url, body, { headers: this.headers });
  }

  eliminarAdjunto(documentoId: number, adjuntoId: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/adjuntos/${adjuntoId}`;
    return this.http.delete(url, { headers: this.headers });
  }

  obtenerAdjuntoPorDocumentoId(
    documentoId: number,
    adjuntoId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/adjuntos/${adjuntoId}`;
    return this.http.get(url, { headers: this.headers });
  }

  // Seguimiento
  obtenerSeguimientoPorDocumentoId(documentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/seguimiento`;
    return this.http.get(url, { headers: this.headers });
  }

  // Reasignacion
  obtenerDocumentoHojaRutaPorDocumentoId(documentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${documentoId}/hojas-ruta`;
    return this.http.get(url, { headers: this.headers });
  }

  //Generar CITE y HR
  generarCiteHr(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}/generarCiteHr`;
    return this.http.post(url, '', { headers: this.headers });
  }
}
