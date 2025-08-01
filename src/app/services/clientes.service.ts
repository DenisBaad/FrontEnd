import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ResponseCliente } from '../shared/models/interfaces/responses/clientes/ResponseCliente';
import { RequestCreateCliente } from '../shared/models/interfaces/requests/clientes/RequestCreateCliente';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  API_URL = environment.Aquiles_URL;
  cookie = inject(CookieService);
  private JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type':'application/json',
      Authorization : `Bearer ${this.JWT_TOKEN}`,
    })
  };

  constructor(private http: HttpClient) { }

  postCliente(request: RequestCreateCliente): Observable<RequestCreateCliente> {
    return this.http.post<RequestCreateCliente>(`${this.API_URL}/clientes`, request, this.httpOptions);
  }

  getClientes(): Observable<ResponseCliente[]> {
    return this.http.get<ResponseCliente[]>(`${this.API_URL}/clientes`, this.httpOptions)
  }

  getById(id: string): Observable<ResponseCliente> {
    return this.http.get<ResponseCliente>(`${this.API_URL}/clientes/${id}`, this.httpOptions);
  }

  putCliente(id: string, request: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/clientes/${id}`, request, this.httpOptions);
  }

  ativarInativarCliente(id: string): Observable<any> {
  return this.http.patch<any>(`${this.API_URL}/clientes/${id}`, {}, this.httpOptions);
  }

  delete(id: string): Observable<any> {
  return this.http.delete<any>(`${this.API_URL}/clientes/${id}`, this.httpOptions);
  }
}
