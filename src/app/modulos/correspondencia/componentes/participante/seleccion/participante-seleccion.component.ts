import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import { Codificador } from 'src/app/comun/modelos';

import { BuzonUsuario, Participante } from '../../../modelos';
import { BuzonFacade, UniOrganizacionalFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-participante-seleccion',
  templateUrl: './participante-seleccion.component.html',
  styles: []
})
export class ParticipanteSeleccionComponent implements OnInit, OnChanges {
  @Input() public tipoParticipante: string;
  @Input() public etiqueta: string;
  @Input() public participantePorDefecto: Participante;

  listaUniOrganizacionalCodificador: Codificador[];
  listaBuzonUsuario: BuzonUsuario[];
  public listaParticipante: Participante[] = [];
  seleccionarParticipante = false;
  participanteSeleccionado: BuzonUsuario;

  constructor(
    private buzonFacade: BuzonFacade,
    private uniOrganizacionalFacade: UniOrganizacionalFacade
  ) {
    //
  }

  ngOnInit(): void {
    this.uniOrganizacionalFacade.obtenerCodificador().then((respuesta) => {
      this.listaUniOrganizacionalCodificador = respuesta.lista;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participantePorDefecto']) {
      if (
        this.participantePorDefecto &&
        !this.listaParticipante.find(
          (item) => item.buzonId === this.participanteSeleccionado.buzonId
        )
      ) {
        this.listaParticipante.push(this.participantePorDefecto);
        // TODO: establecer valor por defecto una vez vaciada la lista
      }
    }
  }

  ejecutarOperacion(evento: any = null): void {
    switch (evento.operacion) {
      case 'uni-organizacional-seleccionado': {
        if (evento.id !== '') {
          this.buzonFacade
            .obtenerBuzonUsuarioPorRefUniOrganizacionalId(evento.id)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.listaBuzonUsuario = respuesta.lista;
              }
            });
        } else {
          this.listaBuzonUsuario = [];
        }
        break;
      }
      case 'seleccionar-participante': {
        this.seleccionarParticipante = true;
        break;
      }
      case 'participante-seleccionado': {
        this.participanteSeleccionado = this.listaBuzonUsuario.find(
          (item) => item.id === evento.id
        );
        this.ejecutarAccion({ accion: 'agregar' });
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'agregar': {
        if (
          !this.listaParticipante.find(
            (item) => item.buzonId === this.participanteSeleccionado.buzonId
          )
        ) {
          const participante = new Participante();
          participante.tipo = this.tipoParticipante.toUpperCase();
          participante.nombre = this.participanteSeleccionado.nombre;
          participante.puesto = this.participanteSeleccionado.buzonPuesto;
          participante.uniOrganizacional =
            this.participanteSeleccionado.buzonUniOrganizacional;
          participante.entidad = 'ADSIB'; // TODO: obtener la entidad de la base sesion o de la base de datos
          participante.buzonId = this.participanteSeleccionado.buzonId;
          this.listaParticipante.push(participante);
          this.seleccionarParticipante = false;
        }
        break;
      }
      case 'quitar': {
        this.listaParticipante = this.listaParticipante.filter(
          (item) => item.buzonId !== evento.buzonId
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
