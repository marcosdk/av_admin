import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuarios.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  

  apiGatewayUrl= environment.apiUrlApiGateway;
  private url = `${this.apiGatewayUrl}api/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  buscar(sub: string): Observable<Usuario> {
 
    return this.http.get<Usuario>(`${this.url}/${sub}`);
  }

  criar(data: any) {
    return this.http.post(this.url, data);
  }

  atualizar(sub: string, data: any) {
    return this.http.put(`${this.url}/${sub}`, data);
  }

  alterarStatus(sub: string, ativo: boolean) {
    return this.http.post(`${this.url}/${sub}/status`, { ativo });
  }

  resetSenha(sub: string) {
    return this.http.post(`${this.url}/${sub}/reset-senha`, {});
  }

  deletar(sub: string) {
    return this.http.delete(`${this.url}/${sub}`);
  }

}