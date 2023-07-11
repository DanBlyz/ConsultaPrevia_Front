import {
  Component,
  HostListener,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Documento } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';
import { Participante } from '../../../modelos/participante.model';

@Component({
  selector: 'app-correspondencia-documento-resumen',
  templateUrl: './documento-resumen.component.html',
  styles: []
})
export class DocumentoResumenComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  documento: Documento;
  listaRemitenteExterno: Participante[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private documentoFacade: DocumentoFacade
  ) {
    if (!this.documento) {
      this.documento = new Documento();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          this.documento = documento;
          this.listaRemitenteExterno = this.documento.listaParticipante.filter(
            (participante) => participante.tipo === 'REMITENTE-EXTERNO'
          );
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
