import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutenticacionGuard } from '../../seguridad/guardias';
import { ContenedorComponent } from '../admin-lte3/componentes';
import {
  BandejaDetalleAprobarComponent,
  BandejaArchivadoComponent,
  BandejaDetalleArchivarComponent,
  BandejaBorradorComponent,
  BandejaDetalleDerivarComponent,
  BandejaDetalleVerComponent,
  BandejaEntradaComponent,
  BandejaEnviadoComponent,
  BandejaDetalleEnviarComponent,
  BandejaSalidaComponent
} from './componentes/bandeja';

import { BuzonListaComponent } from './componentes/buzon';
import { BuzonUsuarioListaComponent } from './componentes/buzon-usuario';
import { ClasificacionListaComponent } from './componentes/clasificacion';
import { ContactoListaComponent } from './componentes/contacto';
import {
  DocumentoArchivoCentralComponent,
  DocumentoArchivoCentralDetalleComponent,
  DocumentoArchivoComponent,
  DocumentoArchivoDetalleComponent
} from './componentes/documento';
import { ParametroListaComponent } from './componentes/parametro';
import {
  PlantillaListaComponent,
  PlantillaFormularioComponent
} from './componentes/plantilla';
import { TipoDocumentoListaComponent } from './componentes/tipo-documento';
import {
  GrupoListaComponent,
  GrupoFormularioComponent
} from './componentes/grupo';
import { GrupoBuzonListaComponent } from './componentes/grupo-buzon';
import {
  RolListaComponent,
  RolFormularioComponent
} from './componentes/rol';
import { UsuarioListaComponent } from './componentes/usuario';
import { CuentaListaComponent } from './componentes/cuenta';
import { 
  TramiteListaComponent,
  TramiteBuscadorComponent,
  TramiteDetalleComponent,
  TramiteFormularioComponent
} from './componentes/tramite';

import { 
  ProvidenciaListaComponent,
  ProvidenciaBuscadorComponent,
  ProvidenciaDetalleComponent,
  ProvidenciaFormularioComponent,
} from './componentes/providencia';

import { 
  NotificacionListaComponent,
  NotificacionBuscadorComponent,
  NotificacionDetalleComponent,
  NotificacionFormularioComponent
} from './componentes/notificacion';
import { ActoAdministrativoListaComponent } from './componentes/acto-administrativo';
import { PagoCptListaComponent } from './componentes/pago-cpt';

import { 
  ViajeListaComponent,
  ViajeBuscadorComponent,
  ViajeDetalleComponent,
  ViajeFormularioComponent
} from './componentes/viaje';

import { 
 InformeListaComponent,
 InformeBuscadorComponent,
 InformeDetalleComponent,
 InformeFormularioComponent
} from './componentes/informe';
import { ResolucionListaComponent } from './componentes/resolucion';
import { ReunionListaComponent } from './componentes/reunion';

const routes: Routes = [
  {
    path: '',
    component: ContenedorComponent,
    canActivate: [],
    children: [
      {
        path: 'correspondencia/tipos-documento',
        component: TipoDocumentoListaComponent,
        canActivate: [],
        data: {
          title: 'Administración de tipos de documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Tipos de documento' }
          ],
          roles: ['']
        }
      },
      {
        path: 'correspondencia/clasificaciones',
        component: ClasificacionListaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Administración de clasificaciones',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Clasificaciones' }
          ],
          roles: ['CORRESPONDENCIA - ADMINISTRADOR']
        }
      },
      {
        path: 'correspondencia/contactos',
        component: ContactoListaComponent,
        canActivate: [],
        data: {
          title: 'Contactos externos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Contactos' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/buzones',
        component: BuzonListaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Buzones',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Buzones' }],
          roles: ['CORRESPONDENCIA - ADMINISTRADOR']
        }
      },
      {
        path: 'correspondencia/buzones/:buzonId/usuarios',
        component: BuzonUsuarioListaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Buzones',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Buzones', url: '/correspondencia/buzones' },
            { title: 'Usuarios' }
          ],
          roles: ['CORRESPONDENCIA - ADMINISTRADOR']
        }
      },
      {
        path: 'correspondencia/plantillas',
        component: PlantillaListaComponent,
        canActivate: [],
        data: {
          title: 'Administración de plantillas',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Plantillas' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/plantillas/crear',
        component: PlantillaFormularioComponent,
        canActivate: [],
        data: {
          title: 'Creación de plantilla',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Plantillas', url: '/correspondencia/plantillas' },
            { title: 'Crear' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/plantillas/:id/modificar',
        component: PlantillaFormularioComponent,
        canActivate: [],
        data: {
          title: 'Modificación de plantilla',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Plantillas', url: '/correspondencia/plantillas' },
            { title: 'Modificar' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/parametros',
        component: ParametroListaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Parámetros',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Parámetros' }],
          roles: ['CORRESPONDENCIA - ADMINISTRADOR']
        }
      },
      {
        path: 'correspondencia/grupos',
        component: GrupoListaComponent,
        canActivate: [],
        data: {
          title: 'Grupos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Grupos' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/grupos/crear',
        component: GrupoFormularioComponent,
        canActivate: [],
        data: {
          title: 'Creación de Grupo',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Grupos', url: '/correspondencia/grupos' },
            { title: 'Crear' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/grupos/:id/modificar',
        component: GrupoFormularioComponent,
        canActivate: [],
        data: {
          title: 'Modificación de grupo',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Grupos', url: '/correspondencia/grupos' },
            { title: 'Modificar' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/grupos-buzon/:grupoId/buzones',
        component: GrupoBuzonListaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Grupos',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Grupos', url: '/correspondencia/grupos' },
            { title: 'Buzones' }
          ],
          roles: ['CORRESPONDENCIA - ADMINISTRADOR']
        }
      },
      {
        path: 'correspondencia/bandeja-borradores',
        component: BandejaBorradorComponent,
        canActivate: [],
        data: {
          title: 'Bandeja de borradores',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Borradores' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/bandeja-entrada',
        component: BandejaEntradaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Bandeja de entrada',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Entrada' }],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/bandeja-salida',
        component: BandejaSalidaComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Bandeja de salida',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Salida' }],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/bandeja-enviados',
        component: BandejaEnviadoComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Bandeja de enviados',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Enviados' }],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/bandeja-archivados',
        component: BandejaArchivadoComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Bandeja de archivados',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Archivados' }],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/documentos/:id/enviar',
        component: BandejaDetalleEnviarComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Enviar documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/documentos' },
            { title: 'Enviar' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/documentos/:id/aprobar',
        component: BandejaDetalleAprobarComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Aprobar documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/documentos' },
            { title: 'Aprobar' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/documentos/:id/derivar',
        component: BandejaDetalleDerivarComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Derivar documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/documentos' },
            { title: 'Derivar' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/documentos/:id/detalle',
        component: BandejaDetalleVerComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Detalle de documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/documentos' },
            { title: 'Detalle de documento' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/documentos/:id/archivado',
        component: BandejaDetalleArchivarComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Documento archivado',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/documentos' },
            { title: 'Documento archivado' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/archivo',
        component: DocumentoArchivoComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Archivo',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Archivo' }],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/archivo/:id/detalle',
        component: DocumentoArchivoDetalleComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Detalle de documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/archivo' },
            { title: 'Detalle de documento' }
          ],
          roles: [
            'CORRESPONDENCIA - ADMINISTRADOR',
            'CORRESPONDENCIA - USUARIO'
          ]
        }
      },
      {
        path: 'correspondencia/archivo-central',
        component: DocumentoArchivoCentralComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Archivo central',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Archivo central' }
          ],
          roles: ['CORRESPONDENCIA - ARCHIVO CENTRAL']
        }
      },
      {
        path: 'correspondencia/archivo-central/:id/detalle',
        component: DocumentoArchivoCentralDetalleComponent,
        canActivate: [AutenticacionGuard],
        data: {
          title: 'Detalle de documento',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Documentos', url: '/correspondencia/archivo-central' },
            { title: 'Detalle de documento' }
          ],
          roles: ['CORRESPONDENCIA - ARCHIVO CENTRAL']
        }
      },
      {
        path: 'correspondencia/roles',
        component: RolListaComponent,
        canActivate: [],
        data: {
          title: 'Roles',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Roles' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/roles/crear',
        component: RolFormularioComponent,
        canActivate: [],
        data: {
          title: 'Creación de Rol',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Roles', url: '/correspondencia/roles' },
            { title: 'Crear' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/roles/:id/modificar',
        component: RolFormularioComponent,
        canActivate: [],
        data: {
          title: 'Modificación de rol',
          urls: [
            { title: 'Inicio', url: '/inicio' },
            { title: 'Roles', url: '/correspondencia/roles' },
            { title: 'Modificar' }
          ],
          roles: []
        }
      },
      {
        path: 'correspondencia/usuarios',
        component: UsuarioListaComponent,
        canActivate: [],
        data: {
          title: 'Usuarios',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Usuarios' }],
          roles: []
        }
      },
      {
        path: 'correspondencia/cuentas',
        component: CuentaListaComponent,
        canActivate: [],
        data: {
          title: 'Cuentas',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Cuentas' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/tramites',
        component: TramiteListaComponent,
        canActivate: [],
        data: {
          title: 'Tramites',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Tramites' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/providencias',
        component: ProvidenciaListaComponent,
        canActivate: [],
        data: {
          title: 'Providencias',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Providencias' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/notificaciones',
        component: NotificacionListaComponent,
        canActivate: [],
        data: {
          title: 'Notificaciones',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Notificaciones' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/actos-administrativos',
        component: ActoAdministrativoListaComponent,
        canActivate: [],
        data: {
          title: 'Actos Administrativos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Actos Administrativos' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/pagos-cpt',
        component: PagoCptListaComponent,
        canActivate: [],
        data: {
          title: 'Pagos Cpt',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Pagos Cpt' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/viaje',
        component: ViajeListaComponent,
        canActivate: [],
        data: {
          title: 'Viaje',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Viaje' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/correspondencia/informe',
        component: InformeListaComponent,
        canActivate: [],
        data: {
          title: 'Informe',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Informe' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/correspondencia/notificacion',
        component: NotificacionListaComponent,
        canActivate: [],
        data: {
          title: 'Notificacion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Notificacion' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/correspondencia/resolucion',
        component: ResolucionListaComponent,
        canActivate: [],
        data: {
          title: 'Resolucion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Resolucion' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/correspondencia/acto-administrativo',
        component: ActoAdministrativoListaComponent,
        canActivate: [],
        data: {
          title: 'Actos Administrativos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Acto Administrativo' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/correspondencia/reunion',
        component: ReunionListaComponent,
        canActivate: [],
        data: {
          title: 'Reuniones',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Reuniones' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/correspondencia/informe',
        component: InformeListaComponent,
        canActivate: [],
        data: {
          title: 'Informes',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Informes' }],
          roles: []
        }
      },
      {
        path: 'Mediacion/correspondencia/resolucion',
        component: ResolucionListaComponent,
        canActivate: [],
        data: {
          title: 'Resolucion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Resolucion' }],
          roles: []
        }
      },
      {
        path: 'Mediacion/correspondencia/reunion',
        component: ReunionListaComponent,
        canActivate: [],
        data: {
          title: 'Reunion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Reunion' }],
          roles: []
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrespondenciaRoutingModule {}
