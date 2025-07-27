import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { LoginResponse } from '../shared/models/interfaces/responses/login/loginResponse';
import { LoginRequest } from '../shared/models/interfaces/requests/login/loginRequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_URL = environment.Aquiles_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(take(1));
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
    return JWT_TOKEN ? true : false;
  }
}
