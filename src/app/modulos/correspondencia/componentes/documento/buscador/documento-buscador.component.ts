import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Codificador } from 'src/app/comun/modelos';
import { FuncionesHelper } from '../../../../../comun/auxiliares';

import {
  TipoDocumentoFacade,
  ClasificacionFacade,
  UniOrganizacionalFacade
} from '../../../fachadas';
import { DocumentoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-documento-buscador',
  templateUrl: './documento-buscador.component.html',
  styles: []
})
export class DocumentoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: DocumentoFilter;
  @Input() colapsado = true;
  @Input() filtrarPorUniOrganizacional = false;

  formBuscador: FormGroup;

  listaTipoDocumentoCodificador: Codificador[];
  listaClasificacionCodificador: Codificador[];
  listaUniOrganizacionalCodificador: Codificador[];

  constructor(
    private fb: FormBuilder,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private clasificacionFacade: ClasificacionFacade,
    private uniOrganizacionalFacade: UniOrganizacionalFacade
  ) {
    this.formBuscador = this.fb.group({
      cite: [''],
      citeExterno: [''],
      referencia: [''],
      // prioridad: [''],
      observacion: [''],
      estaImpreso: [''],
      tipoDocumentoId: [''],
      clasificacionId: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      hojaRutaNumero: [''],
      uniOrganizacionalId: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      cite: this.objeto?.cite || '',
      citeExterno: this.objeto?.citeExterno || '',
      referencia: this.objeto?.referencia || '',
      observacion: this.objeto?.observacion || '',
      // prioridad: this.objeto?.prioridad || '',
      estaImpreso: this.objeto?.estaImpreso || '',
      tipoDocumentoId: this.objeto?.tipoDocumentoId || '',
      clasificacionId: this.objeto?.clasificacionId || '',
      fechaDesde: this.objeto?.fechaDesde || '',
      fechaHasta: this.objeto?.fechaHasta || '',
      hojaRutaNumero: this.objeto?.hojaRutaNumero || '',
      uniOrganizacionalId: this.objeto?.uniOrganizacionalId || ''
    });

    this.tipoDocumentoFacade.obtenerCodificador().then((respuesta) => {
      this.listaTipoDocumentoCodificador = respuesta.lista;
    });
    this.clasificacionFacade.obtenerCodificador().then((respuesta) => {
      this.listaClasificacionCodificador = respuesta.lista;
    });
    if (this.filtrarPorUniOrganizacional) {
      this.uniOrganizacionalFacade.obtenerCodificador().then((respuesta) => {
        this.listaUniOrganizacionalCodificador = respuesta.lista;
      });
    }
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as DocumentoFilter;
    this.accion.emit({
      accion: 'buscar',
      documento: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      cite: '',
      citeExterno: '',
      referencia: '',
      // prioridad: '',
      estaImpreso: '',
      tipoDocumentoId: '',
      clasificacionId: '',
      fechaDesde: '',
      fechaHasta: '',
      hojaRutaNumero: '',
      uniOrganizacionalId: ''
    });
  }
}
