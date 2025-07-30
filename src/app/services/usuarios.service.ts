import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { RequestCreateUsuario } from '../shared/models/interfaces/requests/usuarios/RequestCreateUsuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private API_URL = environment.Aquiles_URL;

  constructor(private http: HttpClient) { }

  postUsuario(request: RequestCreateUsuario): Observable<RequestCreateUsuario> {
      return this.http.post<RequestCreateUsuario>(`${this.API_URL}/usuarios`, request);
    }
}
