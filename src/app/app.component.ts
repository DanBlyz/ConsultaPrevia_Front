import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gestion-documental';

  constructor(@Inject(DOCUMENT) document: Document) {
    document.documentElement.lang = 'es';
  }
}
