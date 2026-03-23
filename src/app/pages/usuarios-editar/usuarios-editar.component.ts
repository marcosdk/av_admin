import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../usuarios-lista/usuarios.service';

@Component({
  selector: 'app-usuarios-editar',
  standalone: false,
  
  templateUrl: './usuarios-editar.component.html',
  styleUrl: './usuarios-editar.component.css'
})

export class UsuariosEditarComponent implements OnInit {

  sub: string | null = null;

  erroEmail = '';
  erroSenha = '';
  erroGrupo = '';

  email = '';
  nome = '';
  senhaTemporaria = 'S&nha2026';
  ativo = true;

  //grupos = ['secretaria','portaria'];
  grupos = ['secretaria'];

  gruposSelecionados: string[] = [];
  gruposDisponiveis: string[] = [];

  grupoDisponivelSelecionado: string | null = null;
  grupoSelecionadoSelecionado: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.sub = this.route.snapshot.paramMap.get('id');

    this.gruposDisponiveis = [...this.grupos];

    if(this.sub && this.sub !== 'novo'){
     
      this.service.buscar(this.sub).subscribe(u=>{
       
        this.email = u.email;
        this.nome = u.nome;
        this.ativo = u.ativo;

        this.gruposSelecionados = u.grupos;

        this.gruposDisponiveis =
          this.grupos.filter(g => !this.gruposSelecionados.includes(g));

      });

    }

  }

  selecionarDisponivel(g: string){
    this.grupoDisponivelSelecionado = g;
  }

  selecionarSelecionado(g: string){
    this.grupoSelecionadoSelecionado = g;
  }

  adicionarGrupo(){

    if(!this.grupoDisponivelSelecionado) return;

    this.gruposSelecionados.push(this.grupoDisponivelSelecionado);

    this.gruposDisponiveis =
      this.gruposDisponiveis.filter(g => g !== this.grupoDisponivelSelecionado);

    this.grupoDisponivelSelecionado = null;

  }

  removerGrupo(){

    if(!this.grupoSelecionadoSelecionado) return;

    this.gruposDisponiveis.push(this.grupoSelecionadoSelecionado);

    this.gruposSelecionados =
      this.gruposSelecionados.filter(g => g !== this.grupoSelecionadoSelecionado);

    this.grupoSelecionadoSelecionado = null;

  }

  salvar(){

    if(!this.validar()){
      return;
    }

    const data = {

      email:this.email,
      nome:this.nome,
      senhaTemporaria:this.senhaTemporaria,
      grupos:this.gruposSelecionados,
      ativo:this.ativo

    };

    if(!this.sub || this.sub === 'novo'){

      this.service.criar(data)
      .subscribe(()=>this.router.navigate(['/usuarios']));

    }
    else{

      this.service.atualizar(this.sub,data)
      .subscribe(()=>this.router.navigate(['/usuarios']));

    }

  }

  voltar(){
    this.router.navigate(['/usuarios']);
  }

  validar(): boolean {

    this.erroEmail = '';
    this.erroSenha = '';
    this.erroGrupo = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const senhaRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if(!this.email || !emailRegex.test(this.email)){
      this.erroEmail = "Informe um e-mail válido.";
      return false;
    }

    if(this.sub === 'novo'){
      if(!senhaRegex.test(this.senhaTemporaria)){
        this.erroSenha =
        "Senha deve ter 8 caracteres, maiúscula, minúscula, número e símbolo.";
        return false;
      }
    }

    if(this.gruposSelecionados.length === 0){
      this.erroGrupo = "Selecione ao menos um grupo.";
      return false;
    }

    return true;
  }

  excluir(){

    if(!this.sub) return;

    const confirmar = confirm("Tem certeza que deseja excluir este usuário?\n\nEsta ação não pode ser desfeita.");

    if(!confirmar) return;

    this.service.deletar(this.sub)
      .subscribe(()=>{
        alert("Usuário excluído com sucesso.");
        this.router.navigate(['/usuarios']);
      });

  }

}