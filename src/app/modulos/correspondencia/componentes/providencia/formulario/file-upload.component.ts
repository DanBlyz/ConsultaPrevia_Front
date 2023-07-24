import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      console.log('Selecciona un archivo antes de subirlo.');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://localhost:3000/files/upload', formData).subscribe(
      (response) => {
        console.log(response.message); // Mensaje del servidor
      },
      (error) => {
        console.error('Error al subir el archivo:', error);
      }
    );
  }
  downloadPDF() {
    const filename = '613b63ab43a53c06f74c2f14e4637c58'; // Reemplaza con el nombre del archivo que deseas descargar
    const url = `http://localhost:3000/files/download/${filename}`;

    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data) => {
        this.showPDF(data);
      },
      (error) => {
        console.error('Error al descargar el PDF:', error);
      }
    );
  }

  showPDF(data: ArrayBuffer) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}