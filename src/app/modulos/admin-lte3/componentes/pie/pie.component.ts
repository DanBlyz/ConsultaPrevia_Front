import { Component } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-lte3-pie',
  templateUrl: './pie.component.html',
  styles: []
})
export class PieComponent {
  entidad: string = environment.entidad;
  version: string = environment.version;
}
