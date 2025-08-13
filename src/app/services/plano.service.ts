import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, take } from 'rxjs';
import { GetPlanoResponse } from '../shared/models/interfaces/responses/planos/GetPlanoResponse';
import { RequestPlano } from '../shared/models/interfaces/requests/planos/RequestPlano';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
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

  Post(plano: RequestPlano): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/planos`, plano,this.httpOptions).pipe(take(1))
  }

  Get(): Observable<GetPlanoResponse[]> {
    return this.http.get<GetPlanoResponse[]>(`${this.API_URL}/planos`, this.httpOptions)
  }

  getById(id: string): Observable<GetPlanoResponse> {
    return this.http.get<GetPlanoResponse>(`${this.API_URL}/planos/${id}`, this.httpOptions).pipe(take(1));
  }

  Put(plano: RequestPlano, id?: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/planos/${id}`, plano, this.httpOptions).pipe(take(1))
  }
}


