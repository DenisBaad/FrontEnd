import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environment/environment';
import { GetFaturaResponse } from '../shared/models/interfaces/responses/faturas/GetFaturaResponse';
import { Observable, take } from 'rxjs';
import { RequestFatura } from '../shared/models/interfaces/requests/faturas/RequestFatura';
@Injectable({
  providedIn: 'root'
})
export class FaturaService {
  http = inject(HttpClient);
  cookie = inject(CookieService);
  private API_URL = environment.Aquiles_URL;
  private JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type':'application/json',
      Authorization : `Bearer ${this.JWT_TOKEN}`,
    })
  };

  Post(fatura: RequestFatura): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/fatura`, fatura,this.httpOptions).pipe(take(1))
  }

  Get(idPlano?: string, clienteId?: string): Observable<GetFaturaResponse[]> {
    const params = new URLSearchParams();

    if (idPlano) {
      params.append('idPlano', idPlano);
    }

    if (clienteId) {
      params.append('clienteId', clienteId);
    }

    const URL = `${this.API_URL}/fatura${params.toString() ? '?' + params.toString() : ''}`;

    return this.http.get<GetFaturaResponse[]>(URL, this.httpOptions).pipe(take(1));
  }

  Put(fatura: RequestFatura, id?: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/fatura/${id}`, fatura, this.httpOptions).pipe(take(1))
  }
}
