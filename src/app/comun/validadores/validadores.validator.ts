import { AbstractControl, ValidatorFn } from '@angular/forms';

export class Validadores {
  static confirmarControl(nombreControl: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === control.parent?.controls[nombreControl].value
        ? null
        : { confirmarControl: false };
    };
  }
  static fechaPosterior(nombreControl: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value >= control.parent?.controls[nombreControl].value
        ? null
        : { fechaPosterior: false };
    };
  }
}
