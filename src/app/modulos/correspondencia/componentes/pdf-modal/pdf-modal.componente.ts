import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pdf-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ modalTitle }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="cerrarModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <embed [src]="safePdfUrl" type="application/pdf" width="750" height="800" />
    </div>
  `
})
export class PdfModalComponent {
  @Input() pdfUrl: string;
  @Input() modalTitle: string;
  @Input() modalRef: NgbModalRef; // Asegúrate de agregar la propiedad modalRef

  constructor(private sanitizer: DomSanitizer) {}

  get safePdfUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

  cerrarModal(): void {
    this.modalRef.close();
  }
}