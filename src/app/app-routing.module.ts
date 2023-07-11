import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AutenticacionGuard } from './seguridad/guardias';
import {
  AutenticacionComponent,
  AutenticacionLdapComponent,
  ContenedorComponent,
  NoEncontradoComponent,
  PerfilComponent,
  RegistrarseComponent,
  TerminosComponent
} from './modulos/admin-lte3/componentes';

const routes: Routes = [
  { path: 'autenticacion', component: AutenticacionComponent },
  { path: 'autenticacion/ldap', component: AutenticacionLdapComponent },
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'terminos-y-condiciones', component: TerminosComponent },
  {
    path: '',
    component: ContenedorComponent,
    canActivate: [AutenticacionGuard],
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
        data: {
          title: 'Perfil',
          urls: [{ title: 'Perfil', url: '/perfil' }]
        }
      }
    ]
  },
  {
    path: '',
    loadChildren: () =>
      import('./modulos/correspondencia/correspondencia.module').then(
        (m) => m.CorrespondenciaModule
      )
  },
  { path: '**', component: NoEncontradoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
