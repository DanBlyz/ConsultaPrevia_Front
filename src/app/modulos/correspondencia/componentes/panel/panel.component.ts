import { Component, OnInit, AfterViewInit ,Inject, LOCALE_ID} from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, PieController, ArcElement, ChartData, ChartOptions } from 'chart.js';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DataService } from '../../servicios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, AfterViewInit {
  nroDpto : number ;
  laPaz : number;
  santaCruz : number;
  cochabamba : number;
  chuquisaca : number;
  tarija : number;
  potosi : number;
  pando : number;
  oruro :number;
  beni :number;



  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    Chart.register(BarController, BarElement, CategoryScale, LinearScale);
    Chart.register(PieController, ArcElement);
  
    // Realizar las solicitudes HTTP para todos los departamentos y almacenar las Promesas resultantes en un arreglo
    const promises: Promise<void>[] = [];
    const departamentos = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Chuquisaca', 'Tarija', 'Potosi', 'Pando', 'Oruro', 'Beni'];
  
    departamentos.forEach((dpto) => {
      const promise = this.obtenerCantidadPorDepartamento(dpto);
      promises.push(promise);
    });
  
    // Esperar a que todas las Promesas se resuelvan antes de generar la gráfica de barras
    Promise.all(promises).then(() => {
      this.generateBarChart();
    });
  
    this.generatePieChart();
  }

  generateBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    console.log(this.nroDpto+" nro dep")
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
}