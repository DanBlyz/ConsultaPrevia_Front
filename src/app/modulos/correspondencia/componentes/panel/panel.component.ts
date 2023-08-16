import { Component, OnInit, AfterViewInit ,Inject, LOCALE_ID} from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, PieController, ArcElement, ChartData, ChartOptions } from 'chart.js';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DataService } from '../../servicios';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewInit {
  nroDpto : number = 0;
  laPaz : number = 0;
  santaCruz : number = 0;
  cochabamba : number = 0;
  chuquisaca : number = 0;
  tarija : number = 0;
  potosi : number = 0;
  pando : number = 0;
  oruro :number = 0;
  beni :number = 0;

  concluido : number = 0;
  pendiente : number = 0;
  interrumpido : number = 0;



  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale);
    Chart.register(PieController, ArcElement);

    const promises: Promise<void>[] = [];
    const departamentos = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Chuquisaca', 'Tarija', 'Potosi', 'Pando', 'Oruro', 'Beni'];
    const promisesEstado: Promise<void>[] = [];
    const estados = ['PENDIENTE', 'CONCLUIDO', 'INTERRUMPIDO'];
  
    departamentos.forEach((dpto) => {
      const promise = this.obtenerCantidadPorDepartamento(dpto);
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      this.totalTramitesDepartamentos();
    });

    estados.forEach((est) => {
      const promiseEstado = this.obtenerCantidadProceso(est);
      promisesEstado.push(promiseEstado);
    });
    Promise.all(promisesEstado).then(() => {
      this.tramitesPorEstado();
    });
  
  
    this.generatePieChart();
  }

  totalTramitesDepartamentos() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Chuquisaca', 'Tarija', 'Potosi', 'Pando','Oruro','Beni'],
      datasets: [
        {
          label: 'Sales',
          data: [this.laPaz, this.santaCruz, this.cochabamba, this.chuquisaca, this.tarija, this.potosi, this.pando,this.oruro,this.beni],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
    const options: ChartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
  }
  tramitesPorEstado() {
    const ctx = document.getElementById('tramiteEstado') as HTMLCanvasElement;
  
    if (this.concluido !== null && this.pendiente !== null && this.interrumpido !== null) {
      const data: ChartData = {
        labels: ['CONCLUIDO', 'PENDIENTE', 'INTERRUMPIDO'],
        datasets: [
          {
            label: 'Sales',
            data: [this.concluido, this.pendiente, this.interrumpido],
            backgroundColor: ['rgba(107, 230, 98, 0.8)', 'rgba(237, 246, 84, 0.8)', 'rgba(255, 147, 124, 0.8)'],
            borderColor: ['rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      };
      const options: ChartOptions = {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
      new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
      });
    } else {
      console.log('Uno de los valores (concluido, pendiente o interrumpido) es nulo o no está definido.');
    }
  }

  generatePieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1
        }
      ]
    };
    new Chart(ctx, {
      type: 'pie',
      data: data
    });
  }
  obtenerCantidadPorDepartamento(dpto: string): Promise<void> {
    const body = { departamento: dpto };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return new Promise<void>((resolve, reject) => {
      this.http.post<any>('http://localhost:3000/tramites/buscar', body, { headers }).subscribe(
        (response) => {
          switch(dpto) { 
            case 'La Paz': { 
                this.laPaz = response.paginado.totalRegistros;
               break; 
            } 
            case 'Santa Cruz': { 
                this.santaCruz = response.paginado.totalRegistros;
               break; 
            } 
            case 'Cochabamba': { 
              this.cochabamba = response.paginado.totalRegistros;
             break; 
            } 
            case 'Oruro': { 
              this.oruro = response.paginado.totalRegistros;
             break; 
            } 
            case 'Tarija': { 
              this.tarija = response.paginado.totalRegistros;
             break; 
            } 
            case 'Beni': { 
              this.beni = response.paginado.totalRegistros;
             break; 
            } 
            case 'Pando': { 
              this.tarija = response.paginado.totalRegistros;
             break; 
            } 
            case 'Potosi': { 
              this.potosi = response.paginado.totalRegistros;
             break; 
            } 
            case 'Chuquisaca': { 
              this.chuquisaca = response.paginado.totalRegistros;
             break; 
            } 
            default: { 
               break; 
            } 
         } 
          resolve(); 
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
          reject(error);
        }
      );
    });
  }
  obtenerCantidadProceso(est: string): Promise<void> {
    const body = { estado: est };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return new Promise<void>((resolve, reject) => {
      this.http.post<any>('http://localhost:3000/tramites/buscar', body, { headers }).subscribe(
        (response) => {
          switch(est) { 
            case 'PENDIENTE': { 
                this.pendiente = response.paginado.totalRegistros;
               break; 
            } 
            case 'CONCLUIDO': { 
                this.concluido = response.paginado.totalRegistros;
               break; 
            } 
            case 'INTERRUMPIDO': { 
              this.interrumpido = response.paginado.totalRegistros;
             break; 
            } 
            default: { 
               break; 
            } 
         } 
          resolve(); 
        },
        (error) => {
          console.error('Error al obtener los datos:', error);
          reject(error);
        }
      );
    });
  }
}