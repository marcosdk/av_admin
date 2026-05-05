import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentsService } from '../payments-lista/payments.service';
import { PaymentData } from '../payments-lista/payments.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-payments-editar',
  standalone: false,
  templateUrl: './payments-editar.component.html',
  styleUrls: ['./payments-editar.component.css']
})
export class PaymentsEditarComponent implements OnInit {

  id: string | null = null;
  filePreviewUrl!: SafeResourceUrl;
  fileType: 'image' | 'pdf' | 'unknown' = 'unknown';

  childName = '';
  cpf = '';
  eventName = '';
  paymentMethod = '';
  amount = '';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING';
  notes = '';
  createdAt = '';

  fileUrl = '';

  erro = '';

  constructor(
    private route: ActivatedRoute,
    private service: PaymentsService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.service.buscarPorId(this.id).subscribe(p => {
        this.childName = p.childName;
        this.cpf = p.cpf;
        this.eventName = p.eventName;
        this.paymentMethod = p.paymentMethod;
        this.amount = p.amount;
        this.status = p.status;
        this.notes = p.notes || '';
        this.createdAt = p.createdAt;

        // 👇 carregar comprovante automaticamente
        this.carregarComprovante();
      });
    }
  }
  carregarComprovante() {
    if (!this.id) return;

    this.service.getFileUrl(this.id).subscribe(res => {

      // 🔥 AQUI ESTÁ A CORREÇÃO
      this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);

      if (res.url.includes('.pdf')) {
        this.fileType = 'pdf';
      } else if (
        res.url.includes('.jpg') ||
        res.url.includes('.jpeg') ||
        res.url.includes('.png')
      ) {
        this.fileType = 'image';
      } else {
        this.fileType = 'unknown';
      }
    });
  }

  salvar() {

    if (!this.amount) {
      this.erro = 'Informe o valor';
      return;
    }

    const data: PaymentData = {
      id: this.id!,
      childName: this.childName,
      cpf: this.cpf,
      eventName: this.eventName,
      eventId: '',
      paymentMethod: this.paymentMethod,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
      fileUrl: '',
      notes: this.notes
    };

    this.service.atualizar(this.id!, data)
      .subscribe(() => this.router.navigate(['/pagamentos']));
  }

  verComprovante() {
    if (!this.id) return;

    this.service.getFileUrl(this.id)
      .subscribe(res => window.open(res.url, '_blank'));
  }

  excluir() {
    if (!this.id) return;

    const confirmar = confirm('Deseja excluir este pagamento?');
    if (!confirmar) return;

    this.service.excluir(this.id)
      .subscribe(() => this.router.navigate(['/pagamentos']));
  }

  voltar() {
    this.router.navigate(['/pagamentos']);
  }
}