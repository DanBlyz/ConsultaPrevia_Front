import { FormBuilder, Validators } from '@angular/forms';
import { Validadores } from './validadores.validator';

describe('Validadores', () => {
  const fb = new FormBuilder();

  describe('confirmarControl()', () => {
    const form = fb.group({
      cuenta: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasenia: [
        '',
        [Validators.required, Validadores.confirmarControl('contrasenia')]
      ]
    });
    test('Debería pasar la validación', () => {
      form.patchValue({
        cuenta: 'adsib',
        contrasenia: 'adsib',
        confirmarContrasenia: 'adsib'
      });
      expect(form.valid).toBeTruthy();
    });
    test('No debería pasar la validación', () => {
      form.patchValue({
        cuenta: 'adsib',
        contrasenia: 'adsib',
        confirmarContrasenia: '12345678'
      });
      expect(form.valid).not.toBeTruthy();
    });
  });

  describe('fechaPosterior()', () => {
    const form = fb.group({
      correoElectronico: ['', Validators.required],
      fecNacimiento: ['', Validators.required],
      fecRegistro: [
        '',
        [Validators.required, Validadores.fechaPosterior('fecNacimiento')]
      ]
    });
    test('Debería pasar la validación (>)', () => {
      form.patchValue({
        correoElectronico: 'adsib@adsib.gob.bo',
        fecNacimiento: '2000-01-01',
        fecRegistro: '2022-01-01'
      });
      expect(form.valid).toBeTruthy();
    });
    test('Debería pasar la validación (=)', () => {
      form.patchValue({
        correoElectronico: 'adsib@adsib.gob.bo',
        fecNacimiento: '2000-01-01',
        fecRegistro: '2000-01-01'
      });
      expect(form.valid).toBeTruthy();
    });
    test('No debería pasar la validación', () => {
      form.patchValue({
        cuenta: 'adsib',
        contrasenia: 'adsib',
        confirmarContrasenia: 'adsib',
        correoElectronico: 'adsib@adsib.gob.bo',
        fecNacimiento: '2000-01-01',
        fecRegistro: '1999-12-31'
      });
      expect(form.valid).not.toBeTruthy();
    });
  });
});
