import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { MenuItem } from 'src/app/comun/modelos';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';
import { appMenu } from 'src/app/app.menu';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-lte3-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styles: []
})
export class MenuLateralComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  usuarioAutenticado: UsuarioAutenticado;

  public menuPrincipal: MenuItem[] = [];
  paginaInicio: string;

  constructor(
    private seguridadFacade: SeguridadFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.AutenticacionState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuarioAutenticado = usuario;
        }
      })
    );

    const roles = this.seguridadFacade.obtenerRoles();
    this.menuPrincipal = this.obtenerMenu(roles);
    this.paginaInicio = environment.paginaInicio;
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  obtenerMenu(roles: string[]): any {
    roles = ['*', ...roles];
    let menu = appMenu.filter((menuItem) => menuItem);

    /*menu = menu.filter((menuItem: any) => {
      return menuItem.roles.some((rol: any) => {
        return roles.includes(rol);
      });
    });*/

    menu.forEach((menuItem: any) => {
      if (menuItem.submenu && menuItem.submenu.length > 0) {
        menuItem.submenu = menuItem.submenu.filter((submenuItem: any) => {
          // return submenuItem.roles.some((rol: any) => {
          //   return roles.includes(rol);
          // });
          return submenuItem;
        });
      }
    });
    return menu;
  }

  async toogleMenu(evento) {
    const elemento = evento.target;
    let elementoPadre = elemento.parentElement;
    while (
      !elementoPadre.classList.contains('nav-item') ||
      elementoPadre.tagName === 'BODY'
    ) {
      elementoPadre = elementoPadre.parentElement;
    }
    const treeviewMenu = elementoPadre.querySelector('.nav-treeview');
    if (treeviewMenu) {
      const elementoLI = elementoPadre;
      const esExpandido = elementoLI.classList.contains('menu-open');
      if (!esExpandido) {
        elementoLI.classList.add('menu-is-opening');
        elementoLI.classList.add('menu-open');
      } else {
        elementoLI.classList.remove('menu-is-opening');
        elementoLI.classList.remove('menu-open');
      }
    }
  }
}
