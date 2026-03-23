import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventData } from './eventos.model';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})

export class EventosService {

    private baseUrl = `${environment.apiUrlApiGateway}api/events`;

    constructor(private http: HttpClient) {}

    listar(): Observable<EventData[]> {
        return this.http.get<EventData[]>(this.baseUrl);
    }

    buscarPorId(id: string): Observable<EventData> {
        return this.http.get<EventData>(`${this.baseUrl}/${id}`);
    }

    criar(evento: EventData): Observable<any> {
        return this.http.post(this.baseUrl, evento);
    }

    atualizar(id: string, evento: EventData): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, evento);
    }

    desativar(id: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${id}/disable`, {});
    }

    excluir(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}