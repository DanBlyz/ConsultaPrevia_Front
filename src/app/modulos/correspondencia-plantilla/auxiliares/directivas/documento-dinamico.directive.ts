import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[documentoDinamico]'
})
export class DocumentoDinamicoDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
