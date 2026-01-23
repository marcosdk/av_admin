import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: false
})
export class CpfFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';

    const cpf = value.toString().replace(/\D/g, ''); // Remove tudo que não for número
    if (cpf.length !== 11) return value.toString(); // Retorna como está se não tiver 11 dígitos

    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
  }
}
