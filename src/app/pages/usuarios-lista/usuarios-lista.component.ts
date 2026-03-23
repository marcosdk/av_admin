import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuarios.model';

@Component({
  selector: 'app-usuarios-lista',
  standalone: false,
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css']
})




export class UsuariosListaComponent implements OnInit {

  
  nome: string = '';
  email: string = '';
  registros: Usuario[] = [];
  todosRegistros: Usuario[] = [];
  

  constructor(
    private service: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }
  pesquisar() {
    const nomeFiltro = this.nome.toLowerCase();
    const emailFiltro = this.email.toLowerCase();

    this.registros = this.todosRegistros.filter(u =>
      (!nomeFiltro || u.nome.toLowerCase().includes(nomeFiltro)) &&
      (!emailFiltro || u.email.toLowerCase().includes(emailFiltro))
    );

    this.paginaAtual = 1;
  }

 

  paginaAtual = 1;
  itensPorPagina = 10;


  carregar() {
    this.service.listar().subscribe(d => {

      this.todosRegistros = d;
      this.registros = d;

      this.paginaAtual = 1;

    });
  }

  editar(sub: string) {
    this.router.navigate([`/usuarios/editar/${sub}`]);
  }

  novo() {
    console.log("novo");
    this.router.navigate(['/usuarios/editar/novo']);
  }

  desativar(u: Usuario) {
    console.log("desativar");
    this.service.alterarStatus(u.sub, !u.ativo)
      .subscribe(() => this.carregar());
  }

  resetSenha(u: Usuario) {
    this.service.resetSenha(u.sub)
      .subscribe(() => alert("Nova senha atualizada para: S&nha2026"));
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