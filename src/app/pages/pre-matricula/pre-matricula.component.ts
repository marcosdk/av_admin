
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreMatriculaService } from './pre-matricula-service';

@Component({
  selector: 'app-pre-matricula',
  standalone: false,
  
  templateUrl: './pre-matricula.component.html',
  styleUrl: './pre-matricula.component.css'
})




export class PreMatriculaComponent implements OnInit {


  nome = '';
  cpf = '';
  registros: any[] = [];


  constructor(
    private service: PreMatriculaService,
    private router: Router
  ) {}


  ngOnInit() {
    this.pesquisar();
  }


  pesquisar() {
    this.service.listar(this.nome, this.cpf)
    .subscribe(dados => this.registros = dados);
    this.paginaAtual = 1;
  }


  novo() {
    this.router.navigate(['/pre-matriculas/novo']);
  }


  editar(cpf: string) {
    this.router.navigate([`/pre-matriculas/${cpf}`]);
  }


  excluir(cpf: string) {
    if (!confirm('Deseja excluir este registro?')) return;


    this.service.excluir(cpf)
    .subscribe(() => this.pesquisar());
  }



  paginaAtual = 1;
  itensPorPagina = 50;

  get totalPaginas(): number {
    return Math.ceil(this.registros.length / this.itensPorPagina);
  }

  get registrosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.registros.slice(inicio, inicio + this.itensPorPagina);
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }
}