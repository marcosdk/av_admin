import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUsuariosService } from '../admin-usuarios.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-admin-usuarios-lista',
  standalone: false,
  
  templateUrl: './admin-usuarios-lista.component.html',
  styleUrl: './admin-usuarios-lista.component.css'
})
export class AdminUsuariosListaComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private service: AdminUsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe(dados => {
      this.usuarios = dados;
    });
  }

  editar(username: string) {
    this.router.navigate(['/admin-usuarios', username]);
  }

  resetarSenha(username: string) {
    if (confirm('Deseja resetar a senha deste usuário?')) {
      this.service.resetarSenha(username).subscribe(() => {
        alert('Email de redefinição enviado');
      });
    }
  }

  excluir(username: string) {
    if (confirm('Deseja excluir este usuário?')) {
      this.service.excluir(username).subscribe(() => {
        this.carregar();
      });
    }
  }
}
