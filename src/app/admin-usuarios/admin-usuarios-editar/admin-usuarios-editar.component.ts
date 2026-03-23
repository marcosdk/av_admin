import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsuariosService } from '../admin-usuarios.service';

@Component({
  selector: 'app-admin-usuarios-editar',
  standalone: false,
  
  templateUrl: './admin-usuarios-editar.component.html',
  styleUrls: ['./admin-usuarios-editar.component.css'] 
})
export class AdminUsuariosEditarComponent implements OnInit {

  username!: string;
  usuario: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdminUsuariosService
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
  }

  salvar() {
    this.service.atualizar(this.username, this.usuario)
      .subscribe(() => {
        alert('Usuário atualizado');
        this.router.navigate(['/admin-usuarios']);
      });
  }

  voltar() {
    this.router.navigate(['/admin-usuarios']);
  }
}