import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject, takeUntil } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from '../../shared/models/interfaces/requests/login/loginRequest';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UsuariosService } from '../../services/usuarios.service';
import { RequestCreateUsuario } from '../../shared/models/interfaces/requests/usuarios/RequestCreateUsuario';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  hideSenha = true;
  hideNovaSenha = true;
  isLoading: boolean = false;
  loginForm: FormGroup;
  isCadastroMode = false;

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private loginService: LoginService, private cookieService: CookieService, private router: Router, private _snackBar: MatSnackBar) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      lembrarEmail: [false]
    });
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, lembrarEmail: true });
    }
  }

  toggleCadastroMode(): void {
    this.isCadastroMode = !this.isCadastroMode;

    if (this.isCadastroMode) {
      this.loginForm.addControl('nome', new FormControl('', Validators.required));
    } else {
      this.loginForm.removeControl('nome');
    }
  }

  onSubmitLoginForm(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isCadastroMode) {
      const req: RequestCreateUsuario = {
        nome: this.loginForm.get('nome')?.value,
        email: this.loginForm.get('email')?.value,
        senha: this.loginForm.get('senha')?.value
      };

      this.usuariosService.postUsuario(req)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this._snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', { duration: 2500 });

            const email = this.loginForm.get('email')?.value;
            this.toggleCadastroMode();
            this.loginForm.reset({ email, senha: '', lembrarEmail: false });
          },
          error: () => {
            this.isLoading = false;
            this._snackBar.open('Não foi possível cadastrar o usuário.', 'Fechar', { duration: 2500 });
          }
        });

    } else {
      this.loginService.login(this.loginForm.value as LoginRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set('USUARIO_INFORMACOES', response?.token);
              this.cookieService.set('USUARIO_NOME', response?.nome);

              if (this.loginForm.get('lembrarEmail')?.value) {
                localStorage.setItem('savedEmail', this.loginForm.get('email')?.value || '');
              } else {
                localStorage.removeItem('savedEmail');
              }

              this.loginForm.reset();
              this.router.navigate(['/clientes']);
              this.isLoading = false;
            }
          },
          error: () => {
            this.isLoading = false;
            this._snackBar.open('Credenciais inválidas!', 'Fechar', { duration: 2000 });
            return EMPTY;
          }
        });
    }
  }

  toggleSenhaVisibility(): void {
    this.hideSenha = !this.hideSenha;
  }

  toggleNovaSenhaVisibility(): void {
    this.hideNovaSenha = !this.hideNovaSenha;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
