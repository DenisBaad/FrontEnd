import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environment/environment';
import { GetFaturaResponse } from '../shared/models/interfaces/responses/faturas/GetFaturaResponse';
import { map, Observable, take } from 'rxjs';
import { RequestFatura } from '../shared/models/interfaces/requests/faturas/RequestFatura';
import { EnumStatusFatura } from '../shared/models/enums/enumStatusFatura';
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

  Get(): Observable<GetFaturaResponse[]> {
    return this.http.get<GetFaturaResponse[]>(`${this.API_URL}/fatura`, this.httpOptions)
  }

  Put(fatura: RequestFatura, id?: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/fatura/${id}`, fatura, this.httpOptions).pipe(take(1))
  }

  public getRelatorioFaturas(usuarioLogadoNome: string, dataAbertura: Date | null, dataFechamento: Date | null, status: EnumStatusFatura | null, clientesSelecionados: string[]): Observable<any> {

    const clienteQuery = clientesSelecionados

    .map(id => `clienteId=${encodeURIComponent(id)}`)
    .join('&');

    let url = `${this.API_URL}/fatura/gerar-relatorio-faturas-clientes?usuarioNome=${encodeURIComponent(usuarioLogadoNome)}`;

    if (clientesSelecionados.length > 0) {
      url += `&${clienteQuery}`;
    }

    if (dataAbertura) {
      url += `&dataAbertura=${dataAbertura.toISOString()}`;
    }

    if (dataFechamento) {
      url += `&dataFechamento=${dataFechamento.toISOString()}`;
    }

    if (status !== null && status !== undefined) {
      url += `&status=${status}`;
    }

    return this.http.get<Blob>(url, {
      responseType: 'blob' as 'json',
      headers: this.httpOptions.headers
      }).pipe(
        map((response: Blob) => {
          const fileURL = URL.createObjectURL(response);
          return fileURL;
          })
        );
    }
}
