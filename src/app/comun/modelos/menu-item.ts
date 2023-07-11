export interface MenuItem {
  ruta: string;
  titulo: string;
  icono: string;
  class: string;
  esEnlace: boolean;
  submenu?: MenuItem[];
  roles: any[];
}
