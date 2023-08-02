import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  obtenerCantidadPorDepartamento(dpto: string): Promise<number> {
    const body = { departamento: dpto };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Promise((resolve, reject) => {
      this.http.post<any>('http://localhost:3000/tramites/buscar', body, { headers }).subscribe(
        (response) => {
          const totalRegistros = response.paginado.totalRegistros;
          console.log('Total de registros:', totalRegistros);
          resolve(totalRegistros);
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
          reject(error);
        }
      );
    });
  }
}