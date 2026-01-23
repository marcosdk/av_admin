import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatriculasService } from '../matriculas/matriculas.service';
import { Router } from '@angular/router';
import { Matricula } from './matricula.model';
import { MatriculaPdfService } from '../matriculas/matricula-pdf.service';

@Component({
  selector: 'app-matriculas-editar',
  standalone: false,
  templateUrl: './matriculas-editar.component.html',
  styleUrls: ['./matriculas-editar.component.css']
})
export class MatriculasEditarComponent implements OnInit {

  matricula: Matricula = {} as Matricula;
  cpf!: string;
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private matriculaService: MatriculasService,
    private pdfService: MatriculaPdfService
  ) {}

  ngOnInit() {
    this.cpf = this.route.snapshot.paramMap.get('cpf')!;
    this.carregarMatricula(this.cpf);
  }

  carregarMatricula(cpf: string) {
    this.matriculaService.buscarPorCpf(cpf).subscribe((dados) => {
      this.matricula = this.converterDynamo(dados);

      console.log('Matricula carregada:', this.matricula);

      if (this.matricula.dataNascimento) {
        this.matricula.dataNascimento = this.formatDateSafe(this.matricula.dataNascimento);
      }

      if (this.matricula.dtExpedicaoRg) {
        this.matricula.dtExpedicaoRg = this.formatDateSafe(this.matricula.dtExpedicaoRg);
      }




    });
  }


  formatDateToDDMMYYYY(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  salvar() {

  }

  private   converterDynamo(item: any): Matricula {
    const out: any = {};

    for (const key of Object.keys(item)) {
      const value = item[key];

      if (value.S !== undefined) out[key] = value.S;
      else if (value.N !== undefined) out[key] = value.N;
      else if (value.BOOL !== undefined) out[key] = value.BOOL;
      else if (value.L !== undefined) out[key] = value.L.map((x: any) => x.S || x.N || x.BOOL);
      else out[key] = value;
    }

    return out as Matricula;
  }


  toggleAlergia(item: string, checked: boolean) {
    if (!this.matricula.manifestacaoAlergia) this.matricula.manifestacaoAlergia = [];
    const idx = this.matricula.manifestacaoAlergia.indexOf(item);
    if (checked && idx === -1) this.matricula.manifestacaoAlergia.push(item);
    if (!checked && idx > -1) this.matricula.manifestacaoAlergia.splice(idx, 1);
}

onFileChange(event: any) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    // reader.result é base64; envie via endpoint de foto ou salve em matricula (ex: matricula.fotoBase64)
    // this.matricula.fotoBase64 = (reader.result as string);
  };
  reader.readAsDataURL(file);
}

  voltar(){
    this.router.navigate(['/matriculas']);
  }



  formatDateSafe(value: string): string {
    if (!value) return '';

    // Já está no formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value;
    }

    // ISO: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const [year, month, day] = value.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }

    // Valor inválido → não tenta converter
    console.warn('Formato de data inválido:', value);
    return '';
  }
  
  gerarPdf() {
    this.pdfService.gerarPdf(this.matricula);
  }

}
