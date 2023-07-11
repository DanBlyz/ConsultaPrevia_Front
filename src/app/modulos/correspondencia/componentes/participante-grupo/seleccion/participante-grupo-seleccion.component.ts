import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import { Codificador } from 'src/app/comun/modelos';

import { Participante, Grupo } from '../../../modelos';
import { GrupoFilter } from '../../../modelos/filtros';
import { GrupoFacade } from '../../../fachadas';
import { DocumentoFacade } from '../../../fachadas/documento.facade';
//import { Participante } from '../../../modelos/participante.model';
import { ServicioBaseService } from '../../../../../comun/servicios/servicio-base.service';
import { SeguimientoFacade } from '../../../fachadas/seguimiento.facade';

@Component({
  selector: 'app-correspondencia-participante-grupo-seleccion',
  templateUrl: './participante-grupo-seleccion.component.html',
  styles: []
})
export class ParticipanteGrupoSeleccionComponent implements OnInit, OnChanges {
  @Input() public tipoParticipante: string;
  @Input() public etiqueta: string;
  @Input() public participantePorDefecto: Participante;

  seleccionarParticipante = false;
  public listaParticipante: Participante[] = [];
  listaGrupoCodificador: Codificador[];
  participanteSeleccionado: Grupo;

  listaGrupo: Grupo[];

  filtroGrupo = new GrupoFilter();

  constructor(
    private grupoFacade: GrupoFacade,
    private documentoFacade: DocumentoFacade
  ) {
    //
  }

  ngOnInit(): void {
    /*this.grupoFacade.obtenerCodificador().then((respuesta) => {
      this.listaGrupoCodificador = respuesta.lista;
    });*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participantePorDefecto']) {
      if (
        this.participantePorDefecto &&
        !this.listaParticipante.find(
          (item) => item.id === this.participanteSeleccionado.id
        )
      ) {
        this.listaParticipante.push(this.participantePorDefecto);
        // TODO: establecer valor por defecto una vez vaciada la lista
      }
    }
  }

  ejecutarOperacion(evento: any = null): void {
    switch (evento.operacion) {
      case 'seleccionar-participante': {
        this.seleccionarParticipante = true;
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'agregar': {
        this.grupoFacade.obtenerPorId(evento.id).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            const participante = new Participante();
            participante.tipo = this.tipoParticipante.toUpperCase();
            participante.nombre = respuesta.objeto?.nombre;
            participante.puesto = null;
            participante.entidad = null;
            participante.buzonId = null;
            participante.codigoGrupo = respuesta.objeto?.codigo;
            this.listaParticipante.push(participante);
            this.seleccionarParticipante = false;
          }
        });
        break;
      }
      case 'quitar': {
        this.listaParticipante = this.listaParticipante.filter(
          (item) => item.id !== evento.id
        );
        break;
      }
      case 'cancelar': {
        this.seleccionarParticipante = false;
        break;
      }
    }
  }
}
