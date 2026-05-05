import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsService } from './payments.service';
import { PaymentData } from './payments.model';

@Component({
  selector: 'app-payments-lista',
  standalone: false,

  templateUrl: './payments-lista.component.html',
  styleUrls: ['./payments-lista.component.css']
})
export class PaymentsListaComponent implements OnInit {

  nome: string = '';
  cpf: string = '';
  status: string = '';
  eventId: string = '';

  registros: PaymentData[] = [];

  paginaAtual = 1;
  itensPorPagina = 10;

  constructor(
    private service: PaymentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(d => {
      this.registros = d;
      this.paginaAtual = 1;
    });
  }

  pesquisar() {
    this.service.listar({
      childName: this.nome,
      cpf: this.cpf,
      status: this.status,
      eventId: this.eventId
    }).subscribe(d => {
      this.registros = d;
      this.paginaAtual = 1;
    });
  }

  editar(id: string) {
    this.router.navigate([`/pagamentos/editar/${id}`]);
  }

  aprovar(p: PaymentData) {
    this.service.aprovar(p.id)
      .subscribe(() => this.carregar());
  }

  reprovar(p: PaymentData) {
    this.service.reprovar(p.id)
      .subscribe(() => this.carregar());
  }

  excluir(p: PaymentData) {
    const confirmar = confirm("Deseja excluir?");
    if (!confirmar) return;

    this.service.excluir(p.id)
      .subscribe(() => this.carregar());
  }

  verComprovante(p: PaymentData) {
    this.service.getFileUrl(p.id)
      .subscribe(res => window.open(res.url, '_blank'));
  }

  get totalPaginas(): number {
    return Math.ceil(this.registros.length / this.itensPorPagina);
  }

  get registrosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.registros.slice(inicio, inicio + this.itensPorPagina);
  }

  irParaPagina(p: number) {
    this.paginaAtual = p;
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }

  exportarExcel() {
    this.service.exportar().subscribe(blob => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'pagamentos.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    });
  }
}