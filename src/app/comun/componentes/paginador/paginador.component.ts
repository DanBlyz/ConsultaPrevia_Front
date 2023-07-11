import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Paginado } from '../../modelos';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent {
  @Input() public mostrarPaginador = false;

  @Output() paginar = new EventEmitter<any>();

  public totalRegistros = 0;
  public registrosPorPagina = 10;
  public paginaActual = 1;
  public totalPaginas = 0;

  public registrosPorPaginaSeleccionado = 10;

  get registroInicial(): number {
    return (this.paginaActual - 1) * this.registrosPorPagina || 10;
  }

  set valores(paginado: Paginado) {
    this.totalRegistros = paginado.totalRegistros;
    this.registrosPorPagina = paginado.registrosPorPagina;
    this.totalPaginas = paginado.totalPaginas;
    this.paginaActual = paginado.pagina;
  }

  constructor() {
    // this.ejecutarAccion('actualizar');
  }

  ejecutarAccion(operacion: string): void {
    switch (operacion) {
      case 'primero': {
        this.paginaActual = 1;
        break;
      }
      case 'anterior': {
        if (Number(this.paginaActual) - 1 >= 1) {
          this.paginaActual = Number(this.paginaActual) - 1;
        } else {
          this.paginaActual = this.totalPaginas;
        }
        break;
      }
      case 'siguiente': {
        if (Number(this.paginaActual) + 1 <= this.totalPaginas) {
          this.paginaActual = Number(this.paginaActual) + 1;
        } else {
          this.paginaActual = 1;
        }
        break;
      }
      case 'ultimo': {
        this.paginaActual = this.totalPaginas;
        break;
      }
      case 'actualizar': {
        this.totalPaginas = Math.ceil(
          this.totalRegistros / this.registrosPorPagina
        );
        this.paginaActual = 1;
        break;
      }
    }

    this.paginar.emit();
  }

  ajustarRegistrosPorPagina(): void {
    this.registrosPorPagina = this.registrosPorPaginaSeleccionado;
    this.actualizarPaginador();
  }

  actualizarPaginador(): void {
    this.ejecutarAccion('actualizar');
  }

  reiniciarPaginador(): void {
    this.ejecutarAccion('primero');
  }
}
