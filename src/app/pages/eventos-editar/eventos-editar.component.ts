


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../eventos-lista/eventos.service';
import { EventData, PaymentOption } from '../eventos-lista/eventos.model';

@Component({
  selector: 'app-eventos-editar',
  standalone: false,
  
  templateUrl: './eventos-editar.component.html',
  styleUrl: './eventos-editar.component.css'
})
export class EventosEditarComponent implements OnInit {

  id: string | null = null;

  name = '';
  date = '';
  description = '';
  active = 'true';

  paymentOptions: PaymentOption[] = [];

  erro = '';

  constructor(
    private route: ActivatedRoute,
    private service: EventosService,
    private router: Router
  ) {}

  ngOnInit(): void {

    
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id && this.id !== 'novo') {
      this.service.buscarPorId(this.id).subscribe(e => {
        this.name = e.name;
        this.date = e.date;
        this.description = e.description;
        this.active = e.active;
        this.paymentOptions = e.paymentOptions || [];
      });
    }
  }

  adicionarPagamento() {
    this.paymentOptions.push({
      id: 'pix_vista',
      label: '',
      description: '',
      value: 0,
      pixKey: '',
      url: ''
    });
  }

  onTipoChange(p: PaymentOption) {
    if (p.id === 'cartao') {
      p.pixKey = '';
    } else {
      p.url = '';
    }
  }

  validarPagamentos(): boolean {
    for (const p of this.paymentOptions) {

      if ((p.id === 'pix_vista' || p.id === 'pix_parcelado') && !p.pixKey) {
        this.erro = 'Informe a chave Pix';
        return false;
      }

      if (p.id === 'cartao' && !p.url) {
        this.erro = 'Informe a URL do cartão';
        return false;
      }
    }

    return true;
  }

  removerPagamento(index: number) {
    this.paymentOptions.splice(index, 1);
  }

  salvar() {

    if (!this.name || !this.date) {
      this.erro = 'Nome e Data são obrigatórios';
      return;
    }

    if (!this.validarPagamentos()) return;

    const data: EventData = {
      id: this.id || '',
      name: this.name,
      date: this.date,
      description: this.description,
      active: this.active,
      paymentOptions: this.paymentOptions
    };

    if (!this.id || this.id === 'novo') {
      console.log("novo");
      this.service.criar(data)
        .subscribe(() => this.router.navigate(['/eventos']));
    } else {
       console.log("editar"); 
      this.service.atualizar(this.id, data)
        .subscribe(() => this.router.navigate(['/eventos']));
    }
  }

  excluir() {
    if (!this.id) return;

    const confirmar = confirm('Deseja excluir este evento?');
    if (!confirmar) return;

    this.service.excluir(this.id)
      .subscribe(() => this.router.navigate(['/eventos']));
  }

  voltar() {
    this.router.navigate(['/eventos']);
  }
}