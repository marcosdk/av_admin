import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from './eventos.service';
import { EventData } from './eventos.model';

@Component({
  selector: 'app-eventos-lista',
  standalone: false,
  
  templateUrl: './eventos-lista.component.html',
  styleUrl: './eventos-lista.component.css'
})
export class EventosListaComponent implements OnInit {

  nome: string = '';
  registros: EventData[] = [];
  todosRegistros: EventData[] = [];

  paginaAtual = 1;
  itensPorPagina = 10;

  constructor(
    private service: EventosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(d => {
      this.todosRegistros = d;
      this.registros = d;
      this.paginaAtual = 1;
    });

    console.log('Carregou os eventos');
    console.log(this.todosRegistros);
  }

  pesquisar() {
    const nomeFiltro = this.nome.toLowerCase();

    this.registros = this.todosRegistros.filter(e =>
      (!nomeFiltro || e.name.toLowerCase().includes(nomeFiltro))
    );

    this.paginaAtual = 1;
  }

  toggle(e: EventData) {
    this.service.desativar(e.id)
      .subscribe(() => this.carregar());
  }

  novo() {
    this.router.navigate(['/eventos/editar/novo']);
  }

  editar(id: string) {
    this.router.navigate([`/eventos/editar/${id}`]);
  }

  desativar(e: EventData) {
    this.service.desativar(e.id)
      .subscribe(() => this.carregar());
  }

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
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }
}