import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutenticacionGuard } from '../../seguridad/guardias';
import { ContenedorComponent } from '../admin-lte3/componentes';

import { BuzonListaComponent } from './componentes/buzon';
import { BuzonUsuarioListaComponent } from './componentes/buzon-usuario';
import { ClasificacionListaComponent } from './componentes/clasificacion';
import { ContactoListaComponent } from './componentes/contacto';
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
import { SujetoIdentificadoListaComponent } from './componentes/sujeto-identificado';
import { PanelComponent } from './componentes/panel/panel.component';
import { DocumentoListaComponent } from './componentes/documento';

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
        path: 'Identificacion/tramites',
        component: TramiteListaComponent,
        canActivate: [],
        data: {
          title: 'Tramites',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Tramites' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/providencias',
        component: ProvidenciaListaComponent,
        canActivate: [],
        data: {
          title: 'Providencias',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Providencias' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/notificaciones',
        component: NotificacionListaComponent,
        canActivate: [],
        data: {
          title: 'Notificaciones',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Notificaciones' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/actos-administrativos',
        component: ActoAdministrativoListaComponent,
        canActivate: [],
        data: {
          title: 'Actos Administrativos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Actos Administrativos' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/pagos-cpt',
        component: PagoCptListaComponent,
        canActivate: [],
        data: {
          title: 'Pagos Cpt',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Pagos Cpt' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/viaje',
        component: ViajeListaComponent,
        canActivate: [],
        data: {
          title: 'Viaje',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Viaje' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/informe',
        component: InformeListaComponent,
        canActivate: [],
        data: {
          title: 'Informe',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Informe' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/documento',
        component: DocumentoListaComponent,
        canActivate: [],
        data: {
          title: 'Documento',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Informe' }],
          roles: []
        }
      },
      {
        path: 'Identificacion/sujeto-identificado',
        component: SujetoIdentificadoListaComponent,
        canActivate: [],
        data: {
          title: 'Sujetos Identificados',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Sujeto Identificado' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/notificacion',
        component: NotificacionListaComponent,
        canActivate: [],
        data: {
          title: 'Notificacion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Notificacion' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/resolucion',
        component: ResolucionListaComponent,
        canActivate: [],
        data: {
          title: 'Resolucion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Resolucion' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/acto-administrativo',
        component: ActoAdministrativoListaComponent,
        canActivate: [],
        data: {
          title: 'Actos Administrativos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Acto Administrativo' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/reunion',
        component: ReunionListaComponent,
        canActivate: [],
        data: {
          title: 'Reuniones',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Reuniones' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/informe',
        component: InformeListaComponent,
        canActivate: [],
        data: {
          title: 'Informes',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Informes' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/documento',
        component: DocumentoListaComponent,
        canActivate: [],
        data: {
          title: 'Documentos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Documentos' }],
          roles: []
        }
      },
      {
        path: 'Deliberacion/pagos-cpt',
        component: PagoCptListaComponent,
        canActivate: [],
        data: {
          title: 'Pagos',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Pagos Cpt' }],
          roles: []
        }
      },
      {
        path: 'Mediacion/resolucion',
        component: ResolucionListaComponent,
        canActivate: [],
        data: {
          title: 'Resolucion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Resolucion' }],
          roles: []
        }
      },
      {
        path: 'Mediacion/reunion',
        component: ReunionListaComponent,
        canActivate: [],
        data: {
          title: 'Reunion',
          urls: [{ title: 'Inicio', url: '/inicio' }, { title: 'Reunion' }],
          roles: []
        }
      },
      {
        path: 'panel',
        component: PanelComponent,
        canActivate: [],
        data: {
          title: 'Panel',
          urls: [{ title: 'Inicio', url: '/inicio' },{ title: 'Panel' }],
          roles: ['']
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
