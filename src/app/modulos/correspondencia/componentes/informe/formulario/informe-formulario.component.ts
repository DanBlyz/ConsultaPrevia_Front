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

import { Informe, SujetoIdentificado } from '../../../modelos';
import { InformeFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient,HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-correspondencia-informe-formulario',
  templateUrl: './informe-formulario.component.html',
  styles: []
})
export class InformeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();
  
  selectedFile: File | null = null;
  listaSujetoIdentificado: SujetoIdentificado []= [];

  suscripcion = new Subscription();

  formInforme: FormGroup;
  botonOperacion: string;

  arr = this.router.url.split('/');
  informe: Informe;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private informeFacade: InformeFacade,
    private toastrService: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {
    if (!this.informe) {
      this.informe = new Informe();
    }

    this.formInforme = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
      asunto: ['', Validators.required],
      encargado: ['', Validators.required],
      nroSujetos: [1, Validators.required],
      comunidad: ['_', Validators.required],
      autoridad: ['_', Validators.required],
      telefono: [0, Validators.required],
      comunidad2: ['_', Validators.required],
      autoridad2: ['_', Validators.required],
      telefono2: [0, Validators.required],
      comunidad3: ['_', Validators.required],
      autoridad3: ['_', Validators.required],
      telefono3: [0, Validators.required],
      comunidad4: ['_', Validators.required],
      autoridad4: ['_', Validators.required],
      telefono4: [0, Validators.required],
      comunidad5: ['_', Validators.required],
      autoridad5: ['_', Validators.required],
      telefono5: [0, Validators.required],
      comunidad6: ['_', Validators.required],
      autoridad6: ['_', Validators.required],
      telefono6: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.informeFacade.CorrespondenciaState$.subscribe(({ informe }) => {
        if (informe) {
          this.informe = informe;
          if (this.tipoOperacion === 'modificar' && this.informe.id) {
            this.formInforme.setValue({
              correlativo: this.informe.correlativo,
              referencia: this.informe.referencia,
              asunto: this.informe.asunto,
              encargado: this.informe.encargado,
              informePdf: this.informe.informePdf,
              nroSujetos: 1,
              comunidad: "",
              autoridad: "",
              telefono: 0,
              comunidad2: "",
              autoridad2: "",
              telefono2: 0,
              comunidad3: "",
              autoridad3: "",
              telefono3: 0,
              comunidad4: "",
              autoridad4: "",
              telefono4: 0,
              comunidad5: "",
              autoridad5: "",
              telefono5: 0,
              comunidad6: "",
              autoridad6: "",
              telefono6: 0
            });
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
      case 'informe':
        this.botonOperacion = 'Guardar';
        break;
      case 'informeDeliberacion':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let informe = new Informe();
    console.log(accion+" ejhecutar accion");
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        const sujeto = new SujetoIdentificado();
        sujeto.comunidad = this.formInforme.value.comunidad;
        sujeto.autoridad = this.formInforme.value.autoridad;
        sujeto.telefono = this.formInforme.value.telefono;
        this.listaSujetoIdentificado[0] = sujeto;
        informe.listaSujetoIdentificado = this.listaSujetoIdentificado;
        this.accion.emit({
          accion: 'guardar',
          informe
        });
        break;
      }
      case 'informe': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/informes/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        informe = { ...this.formInforme.value };
        informe.informePdf = "informe-"+this.selectedFile.name;
        informe.correlativo = "AJAM/"+this.formInforme.get('correlativo').value;
        if(this.formInforme.value.nroSujetos > 0){
          const sujeto = new SujetoIdentificado();
          sujeto.comunidad = this.formInforme.value.comunidad;
          sujeto.autoridad = this.formInforme.value.autoridad;
          sujeto.telefono = this.formInforme.value.telefono;
          this.listaSujetoIdentificado[0] = sujeto;
        }
        if(this.formInforme.value.nroSujetos > 1){
          const sujeto2 = new SujetoIdentificado();
          sujeto2.comunidad = this.formInforme.value.comunidad2;
          sujeto2.autoridad = this.formInforme.value.autoridad2;
          sujeto2.telefono = this.formInforme.value.telefono2;
          this.listaSujetoIdentificado[1] = sujeto2;
        }
        if(this.formInforme.value.nroSujetos > 2){
          const sujeto3 = new SujetoIdentificado();
          sujeto3.comunidad = this.formInforme.value.comunidad3;
          sujeto3.autoridad = this.formInforme.value.autoridad3;
          sujeto3.telefono = this.formInforme.value.telefono3;
          this.listaSujetoIdentificado[2] = sujeto3;
        }
        if(this.formInforme.value.nroSujetos > 3){
          const sujeto4 = new SujetoIdentificado();
          sujeto4.comunidad = this.formInforme.value.comunidad4;
          sujeto4.autoridad = this.formInforme.value.autoridad4;
          sujeto4.telefono = this.formInforme.value.telefono4;
          this.listaSujetoIdentificado[3] = sujeto4;
        }
        if(this.formInforme.value.nroSujetos > 4){
          const sujeto5 = new SujetoIdentificado();
          sujeto5.comunidad = this.formInforme.value.comunidad5;
          sujeto5.autoridad = this.formInforme.value.autoridad5;
          sujeto5.telefono = this.formInforme.value.telefono5;
          this.listaSujetoIdentificado[4] = sujeto5;
        }
        if(this.formInforme.value.nroSujetos > 5){
          const sujeto6 = new SujetoIdentificado();
          sujeto6.comunidad = this.formInforme.value.comunidad6;
          sujeto6.autoridad = this.formInforme.value.autoridad6;
          sujeto6.telefono = this.formInforme.value.telefono6;
          this.listaSujetoIdentificado[5] = sujeto6;
        }
        informe.listaSujetoIdentificado = this.listaSujetoIdentificado;
        let arr = this.router.url.split('/');
        informe.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarInforme',
          informe
        });
        break;
      }
      case 'informeDeliberacion': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        console.log(this.formInforme," deliberacion");
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        if (!this.selectedFile) {
          console.log('Selecciona un archivo antes de subirlo.');
          return;
        }
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        this.http.post<any>('http://localhost:3000/informes/subir-archivo', formData).subscribe(
          (response) => {
            console.log(response.message); // Mensaje del servidor
          },
          (error) => {
            console.error('Error al subir el archivo:', error);
          }
        );
        informe = { ...this.formInforme.value };
        let arr = this.router.url.split('/');
        informe.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarInforme',
          informe
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        this.accion.emit({
          accion,
          informeId: this.informe.id,
          informe
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
  }
}
