import {
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[sePuedeModificar]'
})
export class SePuedeModificarDirective {
  constructor(
    private element: ElementRef,
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set sePuedeModificar(item) {
    if (item.sePuedeModificar) {
      this.viewContainer.createEmbeddedView(this.template);
    } else {
      this.viewContainer.clear();
    }
  }
}
