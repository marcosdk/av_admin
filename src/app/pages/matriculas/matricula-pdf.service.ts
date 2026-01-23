// shared/services/matricula-pdf.service.ts
import { Injectable } from '@angular/core';
import { Matricula } from '../matriculas-editar/matricula.model';
import { buildMatriculaPdf } from './pdf-matricula.builder';

@Injectable({ providedIn: 'root' })
export class MatriculaPdfService {

  async gerarPdf(matricula: Matricula) {
    console.log('oi');
    await buildMatriculaPdf(matricula);
  }

  async gerarPdfEmLote(matriculas: Matricula[]) {
    for (const m of matriculas) {
      await buildMatriculaPdf(m);
      await this.delay(300); // evita travar o browser
    }
  }

  private delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }
}
