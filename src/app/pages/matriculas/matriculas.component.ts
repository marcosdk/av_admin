import { Component, OnInit } from '@angular/core';
import { MatriculasService } from './matriculas.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-matriculas',
  standalone: false,
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit{

  nome = "";
  cpf = "";
  telefone = "";

  matriculas: any[] = [];
   resultadosCompletos: any[] = [];

  // paginação
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor( private http: HttpClient, private router: Router,private matriculsasService: MatriculasService) {}
  ngOnInit(): void {
    this.pesquisar(); // carrega tudo ao entrar na página
  }
  pesquisar() {
    this.matriculsasService.pesquisar(this.nome, this.cpf, this.telefone)
    .subscribe((dados: any[]) => {

      this.resultadosCompletos = dados; // guarda tudo para paginação
      this.totalPages = Math.ceil(dados.length / this.pageSize);
      this.currentPage = 1;

      this.matriculas = dados.slice(0, this.pageSize);
    });
  }

  buscarMatriculas(page: number) {
  this.currentPage = page;

  this.matriculas = this.resultadosCompletos.slice(
    (page - 1) * this.pageSize,
    page * this.pageSize
  );
}

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.buscarMatriculas(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.buscarMatriculas(this.currentPage);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.buscarMatriculas(this.currentPage);
  }

  editar(cpf: string) {
    // coloque sua navegação:
    // this.router.navigate(['/matricula', cpf])
    //alert("Abrir matrícula de: " + cpf);
    this.router.navigate([`/matriculas/${cpf}`]);
  }

  downloadExcel(){
    this.http.get('https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/matricula/excel', {
      responseType: 'blob'
    }).subscribe((data: Blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = 'matricula_desbravadores.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
