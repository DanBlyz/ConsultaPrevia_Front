import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import * as uuid from 'uuid';

import { ModoVisualizacion } from '../../enumeraciones';
import { Bloque, BloqueComponente } from '../../interfaces';
import { DocumentoDinamicoDirective } from '../../auxiliares/directivas';
import {
  AdjuntosComponent,
  CiteExternoComponent,
  ContenidoComponent,
  DesconocidoComponent,
  EncabezadoComponent,
  EspacioComponent,
  FechaComponent,
  FirmaDigitalComponent,
  LineaComponent,
  MembreteComponent,
  ParticipantesComponent,
  PieComponent,
  ReferenciaComponent,
  ReferenciaFinalComponent,
  RemitenteExternoComponent,
  TextoComponent,
  TituloComponent
} from '../bloques';
import { FuncionesHelper } from 'src/app/comun/auxiliares';

@Component({
  selector: 'app-plantilla-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent {
  @ViewChild(DocumentoDinamicoDirective, { static: true })
  documentoDinamico: DocumentoDinamicoDirective;
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() accion = new EventEmitter<any>();

  private parametros: any = {};

  private bloques: Bloque[] = [];
  private componentes: BloqueComponente[] = [];

  private obtenerBloqueComponente(
    bloque: string
  ): ComponentRef<BloqueComponente> {
    const viewContainerRef = this.documentoDinamico.viewContainerRef;
    let bloqueComponente: ComponentRef<BloqueComponente> = null;
    switch (bloque) {
      case MembreteComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(MembreteComponent);
        break;
      }
      case EncabezadoComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(
            EncabezadoComponent
          );
        break;
      }
      case CiteExternoComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(
            CiteExternoComponent
          );
        break;
      }
      case ParticipantesComponent.name: {
        bloqueComponente = viewContainerRef.createComponent<BloqueComponente>(
          ParticipantesComponent
        );
        break;
      }
      case RemitenteExternoComponent.name: {
        bloqueComponente = viewContainerRef.createComponent<BloqueComponente>(
          RemitenteExternoComponent
        );
        break;
      }
      case ReferenciaComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(
            ReferenciaComponent
          );
        break;
      }
      case FechaComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(FechaComponent);
        break;
      }
      case LineaComponent.name: {
        bloqueComponente = viewContainerRef.createComponent(LineaComponent);
        break;
      }
      case TituloComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(TituloComponent);
        break;
      }
      case ContenidoComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(
            ContenidoComponent
          );
        break;
      }
      case FirmaDigitalComponent.name: {
        bloqueComponente = viewContainerRef.createComponent<BloqueComponente>(
          FirmaDigitalComponent
        );
        break;
      }
      case AdjuntosComponent.name: {
        bloqueComponente =
          viewContainerRef.createComponent<BloqueComponente>(AdjuntosComponent);
        break;
      }
      case ReferenciaFinalComponent.name: {
        bloqueComponente = viewContainerRef.createComponent<BloqueComponente>(
          ReferenciaFinalComponent
        );
        break;
      }
      case PieComponent.name: {
        bloqueComponente = viewContainerRef.createComponent(PieComponent);
        break;
      }
      case TextoComponent.name: {
        bloqueComponente = viewContainerRef.createComponent(TextoComponent);
        break;
      }
      case EspacioComponent.name: {
        bloqueComponente = viewContainerRef.createComponent(EspacioComponent);
        break;
      }
      default: {
        bloqueComponente =
          viewContainerRef.createComponent(DesconocidoComponent);
        break;
      }
    }
    return bloqueComponente;
  }

  private cargarBloqueComponente(bloque: Bloque): BloqueComponente {
    const componentRef: ComponentRef<BloqueComponente> =
      this.obtenerBloqueComponente(bloque.componente);
    if (componentRef) {
      componentRef.instance.modoVisualizacion = this.modoVisualizacion;
      componentRef.instance.uid = bloque.uid || uuid.v4();
      //componentRef.instance.ubicacion = bloque.ubicacion;
      componentRef.instance.posicion =
        bloque.posicion !== null && bloque.posicion !== undefined
          ? bloque.posicion
          : this.bloques.length;
      if (bloque.datos && componentRef.instance.datos) {
        /*componentRef.instance.datos.patchValue({
          ...datos
        });*/
        componentRef.instance.datos = { ...bloque.datos };
      }
      if (bloque.configuracion && componentRef.instance.configuracion) {
        componentRef.instance.formConfiguracion.patchValue({
          ...bloque.configuracion
        });
        //componentRef.instance.configuracion = { ...configuracion };
      }
      componentRef.instance.parametros = this.parametros;
      componentRef.instance.operacion.subscribe((evento) => {
        this.ejecutarOperacion(evento);
      });
      componentRef.instance.accion.subscribe((evento) => {
        this.ejecutarAccion(evento);
      });
    }
    return componentRef.instance;
  }

  vaciarBloques(): void {
    const viewContainerRef = this.documentoDinamico.viewContainerRef;
    viewContainerRef.clear();
    this.bloques = [];
    this.componentes = [];
  }

  inicializarBloques(
    bloques: Bloque[],
    modoVisualizacion: ModoVisualizacion = ModoVisualizacion.Esquema
  ) {
    this.vaciarBloques();
    this.modoVisualizacion = modoVisualizacion;
    this.bloques = bloques;
    if (this.bloques.length > 0) {
      this.bloques.forEach((bloque) => {
        const componente = this.cargarBloqueComponente(bloque);
        if (componente) {
          this.componentes.push(componente);
        }
      });
    } else {
      this.bloques = [];
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'subir-bloque': {
        this.subirBloque(evento.uid);
        break;
      }
      case 'bajar-bloque': {
        this.bajarBloque(evento.uid);
        break;
      }
      case 'quitar-bloque': {
        this.quitarBloque(evento.uid);
        break;
      }
      case 'aplicar-configuracion': {
        this.aplicarConfiguracion(evento.uid);
        break;
      }
      default: {
        this.accion.emit(evento);
        break;
      }
    }
  }

  agregarBloque(bloque: Bloque): void {
    const componente = this.cargarBloqueComponente(bloque);
    if (componente) {
      this.bloques.push(componente.obtenerBloque());
      this.componentes.push(componente);
    }
  }

  subirBloque(uid: string): void {
    const posicion = this.bloques.findIndex((bloque) => bloque.uid === uid);
    if (posicion - 1 >= 0) {
      const bloque = this.bloques[posicion];
      bloque.configuracion = { ...this.componentes[posicion].configuracion };
      this.bloques.splice(posicion, 1);
      this.bloques.splice(posicion - 1, 0, bloque);
      this.inicializarBloques(this.bloques, ModoVisualizacion.Esquema);
    }
  }

  bajarBloque(uid: string): void {
    const posicion = this.bloques.findIndex((bloque) => bloque.uid === uid);
    if (posicion + 1 < this.bloques.length) {
      const bloque = this.bloques[posicion];
      bloque.configuracion = { ...this.componentes[posicion].configuracion };
      this.bloques.splice(posicion, 1);
      this.bloques.splice(posicion + 1, 0, bloque);
      this.inicializarBloques(this.bloques, ModoVisualizacion.Esquema);
    }
  }

  quitarBloque(uid: string): void {
    const bloques = this.bloques.filter((item) => item.uid !== uid);
    this.bloques = [];
    this.inicializarBloques(bloques, ModoVisualizacion.Esquema);
  }

  aplicarConfiguracion(uid: string): void {
    const posicion = this.bloques.findIndex((bloque) => bloque.uid === uid);
    this.bloques[posicion].configuracion = {
      ...this.componentes[posicion].configuracion
    };
  }

  obtenerBloques(): Bloque[] {
    return this.bloques;
  }

  obtenerDatos(): Bloque[] {
    const bloques = [];
    this.componentes.forEach((componente) => {
      bloques.push(componente.obtenerBloque());
    });
    return bloques;
  }

  establecerParametros(parametros: any) {
    this.parametros = {
      ...this.parametros,
      ...parametros
    };

    this.componentes.forEach((componente) => {
      componente.parametros = this.parametros;
      componente.establecerParametros(this.parametros);
    });
  }

  async obtenerHash(): Promise<string> {
    const bloques = [];
    this.componentes.forEach((componente) => {
      bloques.push(componente.obtenerBloque());
    });
    if (bloques.length > 0) {
      return await FuncionesHelper.obtenerSHA1(JSON.stringify(bloques));
    } else {
      return null;
    }
  }
}
