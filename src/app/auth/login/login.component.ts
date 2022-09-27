import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;
  loginForm: FormGroup;
  public formSubmitted: boolean = false;

  constructor(
    private _route: Router,
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _ngZone: NgZone
  ) {
    this.loginForm = this._fb.group({
      email: [
        localStorage.getItem('email') || '',
        [Validators.required, Validators.email],
      ],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '413810322718-i72p27esuds32q0md3qns9llcm9k8vef.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    this._usuarioService.loginGoogle(response.credential).subscribe({
      next: () => this._route.navigateByUrl('/'), // Navegar al Dashboard
    });
  }

  login() {
    this._usuarioService.login(this.loginForm.value).subscribe({
      next: () => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this._route.navigateByUrl('/'); // Navegar al Dashboard
      },
      error: (err) => Swal.fire('Error', err.error.msg, 'error'),
    });
  }
}
