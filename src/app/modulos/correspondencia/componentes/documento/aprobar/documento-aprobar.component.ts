import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FuncionesHelper } from 'src/app/comun/auxiliares';
import Swal from 'sweetalert2';

import { DocumentoFacade, SeguimientoFacade } from '../../../fachadas';
import { Adjunto, Documento, Devolver, Destinatario } from '../../../modelos';

@Component({
  selector: 'app-correspondencia-documento-aprobar',
  templateUrl: './documento-aprobar.component.html',
  styles: []
})
export class DocumentoAprobarComponent implements OnInit, OnDestroy {
  @Input() redireccion: string[];

  suscripcion = new Subscription();

  formDevolucion: FormGroup;

  documento: Documento;
  documentoAdjunto: Adjunto;

  constructor(
    private documentoFacade: DocumentoFacade,
    private seguimientoFacade: SeguimientoFacade,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formDevolucion = this.fb.group({
      documentoId: [null, Validators.required],
      aclaracion: [null, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento && this.documento !== documento) {
          this.documento = documento;
          this.formDevolucion.patchValue({
            documentoId: this.documento.id
          });
          this.documentoAdjunto = this.documento.listaAdjunto.find(
            (item) => item.tipo === 'DOCUMENTO'
          );
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'aprobar': {
        Swal.fire({
          title: '¿Está seguro que desea aprobar el documento?',
          text: 'Ésta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, aprobar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade
              .aprobar(evento.id, this.documentoAdjunto.id)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.router.navigate(this.redireccion);
                }
              });
          }
        });
        break;
      }
      case 'devolver': {
        FuncionesHelper.limpiarEspacios(this.formDevolucion);
        if (!this.formDevolucion.valid) {
          this.formDevolucion.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: '¿Está seguro que desea devolver el documento?',
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, devolver',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              const devolver = new Devolver();
              devolver.cite = this.documento.cite;
              devolver.hojaRuta = this.documento.hojaRutaNumero;
              // TODO: obtener informacion del remitente
              devolver.destinatario = new Destinatario();
              devolver.destinatario.nombre = '';
              devolver.destinatario.puesto = '';
              devolver.aclaracion =
                this.formDevolucion.controls['aclaracion'].value;
              devolver.instante = new Date();
              this.documentoFacade
                .devolver(
                  evento.id,
                  this.documentoAdjunto.id,
                  devolver,
                  'APROBAR'
                )
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formDevolucion.controls['aclaracion'].setValue('');
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          });
        }
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }
}
