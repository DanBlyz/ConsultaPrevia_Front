import { Component, Input } from '@angular/core';

import { Bloque } from '../../interfaces';
import { DocumentoComponent } from '..';

@Component({
  selector: 'app-plantilla-menu',
  templateUrl: './menu.component.html',
  styles: []
})
export class MenuComponent {
  @Input() public documento: DocumentoComponent;

  cargarBloque(componente = '') {
    const bloque = {
      componente: componente
    } as Bloque;
    this.documento.agregarBloque(bloque);
  }
}
