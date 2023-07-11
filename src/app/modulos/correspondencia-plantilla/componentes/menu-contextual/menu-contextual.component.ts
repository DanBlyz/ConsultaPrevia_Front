import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-plantilla-menu-contextual',
  templateUrl: './menu-contextual.component.html',
  styleUrls: ['./menu-contextual.component.scss']
})
export class MenuContextualComponent {
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();
  @Input() esConfigurable = false;

  ejecutarOperacion(evento: any): void {
    this.operacion.emit({
      operacion: evento.operacion
    });
  }

  ejecutarAccion(accion: string): void {
    this.accion.emit({
      accion
    });
  }
}
