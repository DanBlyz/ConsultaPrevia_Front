import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import { Codificador } from 'src/app/comun/modelos';

import { Participante, Contacto } from '../../../modelos';
import { ContactoFilter } from '../../../modelos/filtros/contacto.filter';
import { ContactoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-participante-contacto-seleccion',
  templateUrl: './participante-contacto-seleccion.component.html',
  styles: []
})
export class ParticipanteContactoSeleccionComponent
  implements OnInit, OnChanges
{
  @Input() public tipoParticipante: string;
  @Input() public etiqueta: string;
  @Input() public participantePorDefecto: Participante;

  seleccionarParticipante = false;
  public listaParticipante: Participante[] = [];
  listaContactoCodificador: Codificador[];
  listaContactoUniOrganizacional: Contacto[];
  listaContactoPersona: Contacto[];
  participanteSeleccionado: Contacto;

  filtroContacto = new ContactoFilter();

  constructor(private contactoFacade: ContactoFacade) {
    //
  }

  ngOnInit(): void {
    this.contactoFacade.obtenerCodificador().then((respuesta) => {
      this.listaContactoCodificador = respuesta.lista;
    });
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
      case 'entidad-seleccionada': {
        if (evento.nombre !== '') {
          this.filtroContacto.entidad = evento.entidad;
          this.contactoFacade
            .buscar(this.filtroContacto, 0, 0)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.listaContactoPersona = respuesta.lista;
              }
            });
        } else {
          this.listaContactoPersona = [];
        }
        break;
      }
      case 'seleccionar-participante': {
        this.seleccionarParticipante = true;
        break;
      }
      case 'participante-seleccionado': {
        this.participanteSeleccionado = this.listaContactoPersona.find(
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
            (item) => item.id === this.participanteSeleccionado.id
          )
        ) {
          const participante = new Participante();
          participante.tipo = this.tipoParticipante.toUpperCase();
          participante.nombre = this.participanteSeleccionado.nombre;
          participante.puesto = this.participanteSeleccionado.puesto;
          participante.uniOrganizacional =
            this.participanteSeleccionado.uniOrganizacional;
          participante.entidad = this.participanteSeleccionado.entidad;
          participante.buzonId = null;
          this.listaParticipante.push(participante);
          this.seleccionarParticipante = false;
        }
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
