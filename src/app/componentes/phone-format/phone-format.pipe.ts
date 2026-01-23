import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: false
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '';
    
    // Remove caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');

    // Formata como (dd) 99999-9999
    const formatted = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

    return formatted;
  }
}
