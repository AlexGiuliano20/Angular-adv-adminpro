import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public formSubmitted: boolean = false;

  public registerForm = this._fb.group(
    {
      nombre: ['Alex', Validators.required],
      email: ['test100@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],
      password2: ['123456', Validators.required],
      terminos: [true, Validators.required],
    },
    {
      validators: this.passwordIguales('password', 'password2', 'terminos'),
    }
  );

  constructor(
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _route: Router
  ) {}

  crearUsuario() {
    this.formSubmitted = true;

    if (!this.registerForm.valid) {
      return;
    }

    // Realizar el posteo
    this._usuarioService.crearUsuario(this.registerForm.value).subscribe({
      next: () => this._route.navigateByUrl('/'), // Navegar al Dashboard

      error: (error) => Swal.fire('Error', error.error.msg, 'error'),
    });
  }

  constrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    return pass1 !== pass2 && this.formSubmitted ? true : false;
  }

  campoNoValido(campo: string): boolean {
    return this.registerForm.get(campo)?.invalid && this.formSubmitted
      ? true
      : false;
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordIguales(pass1Name: string, pass2Name: string, terminos: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);
      const terminosControl = formGroup.get(terminos);

      terminosControl?.value === true
        ? terminosControl.setErrors(null)
        : terminosControl?.setErrors({ noAceptado: true });

      pass1Control?.value === pass2Control?.value
        ? pass2Control?.setErrors(null)
        : pass2Control?.setErrors({ noEsIgual: true });
    };
  }
}
