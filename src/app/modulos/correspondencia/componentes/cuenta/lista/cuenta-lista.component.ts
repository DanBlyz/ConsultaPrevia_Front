import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { Cuenta } from '../../../modelos';
import { CuentaFilter } from '../../../modelos/filtros';
import { CuentaFacade } from '../../../fachadas';

@Component({
  selector: 'app-cuenta-lista',
  templateUrl: './cuenta-lista.component.html',
  styleUrls: []
})
export class CuentaListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalCuenta') modalCuenta: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: CuentaFilter = new CuentaFilter();
  tipoOperacion: string;

  cuenta: Cuenta = new Cuenta();
  lista: Cuenta[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private cuentaFacade: CuentaFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.cuentaFacade.CorrespondenciaState$.subscribe(
        ({ listaCuenta, cuenta }) => {
          if (listaCuenta.lista) {
            if (listaCuenta.lista.length >= 0) {
              this.lista = listaCuenta.lista;
              if (listaCuenta.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaCuenta.paginado.totalRegistros,
                  listaCuenta.paginado.registrosPorPagina,
                  listaCuenta.paginado.totalPaginas,
                  listaCuenta.paginado.pagina
                );
              }
            }
          }
          if (cuenta) {
            this.cuenta = cuenta;
          }
        }
      )
    );
    this.suscripcion.add(
      this.cuentaFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.cuentaFacade.buscar(
            this.filtro,
            1,
            this.paginador.registrosPorPagina
          );
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.paginar();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    const cuentaTitulo = 'cuenta';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + cuentaTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.cuentaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + cuentaTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.cuentaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + cuentaTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.cuentaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + cuentaTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.cuentaFacade.guardar(evento.cuenta).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.cuentaFacade
          .modificar(evento.cuentaId, evento.cuenta)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.cuentaFacade.eliminar(evento.cuentaId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.cuentaFacade.establecerFiltro(evento.cuenta);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
    }
  }

  paginar(): void {
    if (this.paginador) {
      this.cuentaFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalCuenta, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
