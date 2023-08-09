import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';

import { Reunion } from '../../../modelos';
import { ReunionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-correspondencia-reunion-formulario',
  templateUrl: './reunion-formulario.component.html',
  styles: []
})
export class ReunionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();
  selectedFile: File | null = null;
  selectedCheckbox: string | null = null;

  formReunion: FormGroup;
  botonOperacion: string;

  reunion: Reunion;
  name = 'Angular';
  
  conAcuerdoV = ['TRABAJO','ESCUELA','VIAS','DESASTRES NATURALES'];
  sinAcuerdoV = ['INASISTENCIA','AGRESION','ROTUNDO COTRADICCION','MERCURIO'];
    
  selected: any[] = [];
  cadena : string = "";
  nombreArchivoSeleccionado: string = 'Seleccionar archivo PDF...';
   

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private reunionFacade: ReunionFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    if (!this.reunion) {
      this.reunion = new Reunion();
    }

    this.formReunion = this.fb.group({
      nroReunion: ['', Validators.required],
      conAcuerdo: [false, Validators.required],
      sinAcuerdo: [false,Validators.required],
      motivo: ['', Validators.required],
      reunionRealizada: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.reunionFacade.CorrespondenciaState$.subscribe(({ reunion }) => {
        if (reunion) {
          this.reunion = reunion;
          if (this.tipoOperacion === 'modificar' && this.reunion.id) {
            this.formReunion.setValue({
              nroReunion: this.reunion.nroReunion,
              conAcuerdo: this.reunion.conAcuerdo,
              sinAcuerdo: this.reunion.sinAcuerdo,
              motivo: this.reunion.motivo,
              reunionRealizada: true
            });
            if(this.reunion.actaReunionPdf !== null){
              this.downloadFile(this.reunion.actaReunionPdf);
            }
        
          }
        }
      })
    );

    switch (this.tipoOperacion) {
      case 'crear':
        this.botonOperacion = 'Guardar';
        break;
      case 'modificar':
        this.botonOperacion = 'Modificar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let reunion = new Reunion();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formReunion);
        if (!this.formReunion.valid) {
          this.formReunion.markAllAsTouched();
          return;
        }
        reunion = { ...this.formReunion.value };
        this.accion.emit({
          accion: 'guardar',
          reunion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formReunion);
        if (!this.formReunion.valid) {
          this.formReunion.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile,"reunion-"+this.selectedFile.name.replace("reunion-",""));
        this.http.post<any>('http://localhost:3000/reuniones/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        reunion = { ...this.formReunion.value };
        reunion.actaReunionPdf = "reunion-"+this.selectedFile.name.replace("reunion-","");
        reunion.estado = 'REUNION';
        
          for (let index = 0; index < this.selected.length; index++) {
          if(index !== this.selected.length-1){
            this.cadena =  this.cadena + this.selected[index]+" - ";
          }
          else{
            this.cadena =  this.cadena + this.selected[index];
          }
          console.log(this.selected[index]+"  aqui");
          
        }
        reunion.motivo = this.cadena;
       
        this.accion.emit({
          accion,
          reunionId: this.reunion.id,
          reunion
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const file = event.target.files[0];
    if (file) {
      this.nombreArchivoSeleccionado = file.name;
    } else {
      this.nombreArchivoSeleccionado = 'Seleccionar archivo PDF...';
    }
  }
  downloadFile(nombre : string) {
    // Aquí realiza una solicitud al servidor para obtener los datos del archivo
    const filename = nombre;
    const url = `http://localhost:3000/reuniones/bajar-archivo/${filename}`;
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data) => {
        const file = new Blob([data], { type: 'application/octet-stream' });
        this.selectedFile = new File([file], filename); // Puedes cambiar el nombre del archivo según corresponda
        console.log(this.selectedFile.name);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }
  getSelectedValue(){
    console.log(this.selected);
  }
  onCheckboxChange(checkboxName: string) {
    if (this.selectedCheckbox === checkboxName) {
      // Si el checkbox seleccionado ya está marcado, desmárcalo
      this.formReunion.get(checkboxName)?.setValue(false);
      this.selectedCheckbox = null;
    } else {
      // Marca el checkbox seleccionado y desmarca los otros
      this.selectedCheckbox = checkboxName;
      Object.keys(this.formReunion.controls).forEach((name) => {
        if (name !== checkboxName && name !== 'nroReunion' && name !== 'motivo' && name !== 'reunionRealizada' && name !== 'reunionRealizada') {
          console.log(name);
          this.formReunion.get(name)?.setValue(false);
        }
      });
    }
  }
}
