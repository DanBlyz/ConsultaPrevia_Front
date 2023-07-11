import {
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[sePuedeEliminar]'
})
export class SePuedeEliminarDirective {
  constructor(
    private element: ElementRef,
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set sePuedeEliminar(item) {
    if (item.sePuedeEliminar) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }
}
