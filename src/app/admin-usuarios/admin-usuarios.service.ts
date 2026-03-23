import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

  private baseUrl = environment.apiUrlApiGateway + 'api/admin/users';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  criar(payload: Partial<Usuario>) {
    return this.http.post(this.baseUrl, payload);
  }

  atualizar(username: string, payload: Partial<Usuario>) {
    return this.http.put(`${this.baseUrl}/${username}`, payload);
  }

  resetarSenha(username: string) {
    return this.http.post(`${this.baseUrl}/${username}/reset-password`, {});
  }

  excluir(username: string) {
    return this.http.delete(`${this.baseUrl}/${username}`);
  }
}
