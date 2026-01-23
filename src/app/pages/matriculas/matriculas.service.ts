import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatriculasService {

    private url = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/matricula';

    constructor(private http: HttpClient) {}

    listarMatriculas(): Observable<any[]> {
        return this.http.get<any[]>(this.url);
    }

    buscarPorCpf(cpf: string): Observable<any> {
     return this.http.get<any>(`${this.url}/${cpf}`);
    }
    pesquisar(nome: string, cpf: string, telefone: string): Observable<any[]> {

        let params = new HttpParams();

        if (nome) params = params.set("nome", nome);
        if (cpf) params = params.set("cpf", cpf);
        if (telefone) params = params.set("telefone", telefone);

        return this.http.get<any[]>(this.url, { params });
    }
}
