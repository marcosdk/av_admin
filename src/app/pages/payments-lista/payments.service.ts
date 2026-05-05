import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentData } from './payments.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = `${environment.apiUrlApiGateway}api/payments`;

  constructor(private http: HttpClient) {}

  listar(filtros?: any): Observable<PaymentData[]> {

    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(k => {
        if (filtros[k]) {
          params = params.set(k, filtros[k]);
        }
      });
    }

    return this.http.get<PaymentData[]>(this.baseUrl, { params });
  }

  aprovar(id: string) {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, {});
  }

  reprovar(id: string) {
    return this.http.patch(`${this.baseUrl}/${id}/reject`, {});
  }

  excluir(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getFileUrl(id: string) {
    return this.http.get<{ url: string }>(`${this.baseUrl}/${id}/file`);
  }

  buscarPorId(id: string): Observable<PaymentData> {
    return this.http.get<PaymentData>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: string, data: PaymentData) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  exportar(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export`, {
      responseType: 'blob'
    });
  }
}

