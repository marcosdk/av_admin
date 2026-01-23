
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreMatriculaService } from '../pre-matricula/pre-matricula-service';

@Component({
  selector: 'app-pre-matricula-editar',
  standalone: false,
  
  templateUrl: './pre-matricula-editar.component.html',
  styleUrl: './pre-matricula-editar.component.css'
})


export class PreMatriculaEditarComponent implements OnInit {

  cpf: string = 'novo';

  registro: any = {
    cpf: '',
    nome: '',
    descricao_do_cargo: '',
    unidade: ''
  };

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PreMatriculaService
  ) {}

  ngOnInit(): void {
    this.cpf = this.route.snapshot.paramMap.get('cpf') || 'novo';
    console.log('CPF recebido:', this.cpf);
    if (this.cpf !== 'novo') {
      this.carregarRegistro();
    }
  }

  carregarRegistro() {
    this.loading = true;

    this.service.buscar(this.cpf)
      .subscribe({
        next: (dados) => {
          this.registro = dados;

          console
          this.loading = false;
        },
        error: () => {
          alert('Erro ao carregar pré-cadastro');
          this.loading = false;
          this.voltar();
        }
      });
  }

  salvar() {
    if (!this.registro.cpf || !this.registro.nome) {
      alert('CPF e Nome são obrigatórios');
      return;
    }

    this.registro = {
      ...this.registro,
      cpf: this.registro.cpf?.trim(),
      nome: this.registro.nome?.toUpperCase().trim(),
      descricao_do_cargo: this.registro.descricao_do_cargo?.toUpperCase().trim(),
      unidade: this.registro.unidade?.toUpperCase().trim()
    };

    this.loading = true;

    this.service.salvar(this.registro)
      .subscribe({
        next: () => {
          alert('Pré-cadastro salvo com sucesso');
          this.loading = false;
          this.voltar();
        },
        error: () => {
          alert('Erro ao salvar pré-cadastro');
          this.loading = false;
        }
      });
  }

  voltar() {
    this.router.navigate(['/pre-matriculas']);
  }
}
