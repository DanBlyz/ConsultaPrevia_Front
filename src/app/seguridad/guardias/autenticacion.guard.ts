import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { environment } from 'src/environments/environment';

import { SeguridadFacade } from '../fachadas';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {
  constructor(
    private router: Router,
    private seguridadFacade: SeguridadFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot): any {
    if (!this.seguridadFacade.tokenExpirado()) {
      const roles = this.seguridadFacade.obtenerRoles();
      if (roles) {
        if (
          route.data['roles'] &&
          !route.data['roles'].some((item: string) => roles.includes(item))
        ) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }
    }
    this.seguridadFacade.cerrarSesion();
    //location.reload();
    this.router.navigateByUrl(environment.paginaAutenticacion);
    return false;
  }
}
