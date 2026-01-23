import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PreMatriculaService {


    private url = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/pre-matricula';


    constructor(private http: HttpClient) {}


    listar(nome?: string, cpf?: string) {
        let params = new HttpParams();
        if (nome) params = params.set('nome', nome);
        if (cpf) params = params.set('cpf', cpf);
        return this.http.get<any[]>(this.url, { params });
    }


    buscar(cpf: string) {
        return this.http.get<any>(`${this.url}/${cpf}`);
    }


    salvar(dados: any) {
        return this.http.post(this.url, dados);
    }


    excluir(cpf: string) {
        return this.http.delete(`${this.url}/${cpf}`);
    }
}