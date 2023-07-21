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
}