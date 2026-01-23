import { Component, OnInit, ViewChild,ElementRef, ChangeDetectorRef , NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import imageCompression from 'browser-image-compression';
import { ImageTransform, ImageCroppedEvent } from 'ngx-image-cropper';



@Component({
  selector: 'app-documentos-edit',
  standalone: false,
  
  templateUrl: './documentos-edit.component.html',
  styleUrl: './documentos-edit.component.css'
  
})
export class DocumentosEditComponent implements OnInit {


  imageBase64: string | null = null;
  showCropper: boolean = false;
  imageChangedEvent: any = null;
  currentEditingFile!: any; // mantém o arquivo que está sendo editado
  croppedImage: any = null;
  
  gerandoPDF: boolean = false;
  gerandoPDFCompleto: boolean = false;
  excluindoArquivosSelecionados : boolean = false;

  form!: FormGroup;
  id!: string;
  data: any;

  formData: any = {
    NOME_DESBRAVADOR: '',
    CPF_DESBRAVADOR: '',
    RG_DESBRAVADOR: '',
    DATA_NASCIMENTO: '',
    TELEFONE_CELULAR: '',
    NOME_RESPONSAVEL: '',
    CPF_RESPONSAVEL: '',
    RG_RESPONSAVEL: '',
    UNIDADE: '',
    STATUS: ''
  };

  arquivosSelecionados: string[] = [];
  tipoArquivosSelecionados: string[] = [];

  

  arquivos = [
    { nome: 'RG', link: '/path/to/arquivo1.pdf', key:'rg' , extension: 'pdf', file:'' },
    { nome: 'CPF', link: '/path/to/arquivo2.docx', key:'cpf' , extension: 'pdf',file:''},
  ];

  tiposDocumentos = [
    { key: 'rgDesbravador', label: 'RG' },
    { key: 'cpfDesbravador', label: 'CPF' },
    { key: 'convenioDesbravador', label: 'Convênio do Desbravador' },
    { key: 'susDesbravador', label: 'Sus' },
    { key: 'carteiraVacDesbravador', label: 'Carteira de Vacinação do Desbravador' },
    { key: 'comResidenciaDesbravador', label: 'Comprovante de Residência' },
    { key: 'rgResponsavel', label: 'RG do Responsável' },
    { key: 'cpfResponsavel', label: 'CPF do Responsável' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient,  private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.form = this.fb.group(
      {
        uploadArquivo: [null],
      },
    );
  }

  ngOnInit(): void {
    // Obter o ID da rota.
    this.id = String(this.route.snapshot.paramMap.get('id'));

    
    if (this.id === 'novo') {
      console.log('Novo registro');
      return;
    }

    // Chamar a API com o ID.
    this.getData(this.id);

    // carrega arquivos
    this.getFiles(this.id);
    
  }

  getTiposDisponiveis() {
    const arquivosKeys = this.arquivos.map(a => a.key);
    return this.tiposDocumentos.filter(tipo => !arquivosKeys.includes(tipo.key));
  }

  formatDateToBrazilian(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Converter de dd/MM/yyyy ou ddMMyyyy para yyyy-MM-dd
  formatDateToISO(date: string): string {
    if (date.includes('/')) {
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    }

    // Se estiver no formato ddMMyyyy
    if (/^\d{8}$/.test(date)) {
      const day = date.substring(0, 2);
      const month = date.substring(2, 4);
      const year = date.substring(4, 8);
      return `${year}-${month}-${day}`;
    }

    // Caso não reconheça o formato, retorna o valor original
    return date;
  }


  getFiles(id: string): void {
    this.http.get<{ nome: string; link: string; key: string, extension: string, file:string }[]>(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/list/${id}`).subscribe({
      next: (response) => {
        this.arquivos = response;
      },
      error: (err) => {
        console.error('Erro ao buscar dados', err);
      },
    });
  }

  getData(id: string): void {
    this.http.get(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/${id}`).subscribe({
      next: (response) => {
        this.formData = response;
        if (this.formData.DATA_NASCIMENTO) {
          this.formData.DATA_NASCIMENTO = this.formatDateToBrazilian(this.formData.DATA_NASCIMENTO);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar dados', err);
      },
    });
  }

  confirmDelete(): void {
    if (confirm(`Tem certeza que deseja excluir o regitro de "${this.formData.NOME_DESBRAVADOR}"?`)) {
      this.deleteRegistro(this.id);
    }
  }
  
  deleteRegistro(id: string): void {
    this.http.delete(`https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos?id=${id}`).subscribe({
      next: () => {
        alert('Registro excluído com sucesso.');
        console.log('Dados atualizados com sucesso:');


        const state = sessionStorage.getItem('tableState');
        if (state) {
          const parsedState = JSON.parse(state);
          this.router.navigate(['/documentos'], { state: parsedState });
          sessionStorage.removeItem('tableState'); // limpa depois de usar
        } else {
          this.router.navigate(['/documentos']);
        }   
      },
      error: (error) => {
        alert('Erro ao excluir o documento.');
        console.error(error);
      }
    });
  }

  saveData(): void {

    if (!this.id || this.id === 'novo') {

         // Criar novo registro
         const dataToSend = { ...this.formData };
         console.log('dataToSend.DATA_NASCIMENTO', dataToSend.DATA_NASCIMENTO);
         if (dataToSend.DATA_NASCIMENTO) {
             dataToSend.DATA_NASCIMENTO = this.formatDateToISO(dataToSend.DATA_NASCIMENTO);
             console.log('dataToSend.DATA_NASCIMENTO', dataToSend.DATA_NASCIMENTO);
         }
 
         const postUrl = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos`;
         this.http.post<{ id: string }>(postUrl, dataToSend).subscribe({
             next: (response) => {
                 console.log('Registro criado com sucesso:', response);
                 alert(`Cadastro realizado com sucesso.`);
                 this.router.navigate([`/documentos/${response.id}`]).then(() => {
                    window.location.reload();
                  });
             },
             error: (err) => {
                 console.error('Erro ao criar registro:', err);
             },
         });
 
    } else {

      const dataToSend = { ...this.formData };
      console.log('dataToSend.DATA_NASCIMENTO', dataToSend.DATA_NASCIMENTO);
      if (dataToSend.DATA_NASCIMENTO) {
        dataToSend.DATA_NASCIMENTO = this.formatDateToISO(dataToSend.DATA_NASCIMENTO);
        console.log('dataToSend.DATA_NASCIMENTO', dataToSend.DATA_NASCIMENTO);
      }

      const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos`;
      this.http.put(url, dataToSend).subscribe({
        next: (response) => {
          console.log('Dados atualizados com sucesso:', response);


          const state = sessionStorage.getItem('tableState');
          if (state) {
            const parsedState = JSON.parse(state);
            this.router.navigate(['/documentos'], { state: parsedState });
            sessionStorage.removeItem('tableState'); // limpa depois de usar
          } else {
            this.router.navigate(['/documentos']);
          }
          
        },
        error: (err) => {
          console.error('Erro ao atualizar dados:', err);
        },
      });
    }
  }

  voltar(): void{

    const state = sessionStorage.getItem('tableState');
    if (state) {
      const parsedState = JSON.parse(state);
      this.router.navigate(['/documentos'], { state: parsedState });
      sessionStorage.removeItem('tableState'); // limpa depois de usar
    } else {
      this.router.navigate(['/documentos']);
    }    
  }

  confirmDeleteFile(tipoArquivo: string, keyArquivo: string): void {
    if (confirm(`Tem certeza que deseja excluir o arquivo "${tipoArquivo}"?`)) {
      this.deleteFile(this.id, tipoArquivo, keyArquivo);
    }
  }

  deleteFile(idDesbravador: string, tipoArquivo: string, keyArquivo:string): void {
    const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file/delete`;
  
    const payload = {
      idDesbravador: idDesbravador,
      tipoArquivo: keyArquivo
    };
  
    this.http.post(url, payload).subscribe({
      next: () => {
        alert(`Arquivo "${tipoArquivo}" excluído com sucesso.`);
        this.getFiles(this.id); // Atualiza a lista de arquivos
      },
      error: (error) => {
        alert('Erro ao excluir o arquivo.');
        console.error(error);
      }
    });
  }



  tipoDocumentoSelecionado: string = '';
  arquivoSelecionado: File | null = null;

  async onFileChange(event: any, fieldName: string) {
    const reader = new FileReader();
    let file = event.target.files[0];

    if (file) {


      const allowedTypes = ['image/jpeg', 'application/pdf'];

      if (!allowedTypes.includes(file.type)) {
        alert('Apenas arquivos JPG ou PDF são permitidos.');
        event.target.value = '';
        return;
      }


      // Verifica o tamanho do arquivo
      if ( file.type === 'image/jpeg' && file.size > 1 * 1024 * 1024) {
        try {
          const options = {
            maxSizeMB: 1, // Tamanho máximo em MB
            maxWidthOrHeight: 1920, // Dimensão máxima
            useWebWorker: true,
          };

          // Compacta a imagem
          file = await imageCompression(file, options);
          console.log('Arquivo compactado para:', file.size / 1024, 'KB');
        } catch (error) {
          console.error('Erro ao compactar imagem:', error);
          alert('Erro ao processar o arquivo. Tente novamente.');
          return;
        }
      }

      this.arquivoSelecionado = file;
    }

    // Se o arquivo for válido, você pode atribuí-lo ao formControl
    //this.form.patchValue({ [fieldName]: file });
    reader.onload = () => {
      this.form.patchValue({ [fieldName]: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  @ViewChild('fileInput') fileInput!: ElementRef;
  
  uploadDocumento() {
    if (!this.tipoDocumentoSelecionado || !this.arquivoSelecionado) {
      alert('Selecione um tipo de documento e um arquivo JPG ou PDF.');
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Simulação de envio para o servidor
    const formData = new FormData();
    formData.append('tipoDocumento', this.tipoDocumentoSelecionado);
    formData.append('arquivo', this.arquivoSelecionado);

    const apiUrlUpload   = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file';
    const payloadUpload = {
      idDesbravador: this.id,
      tipoArquivo: this.tipoDocumentoSelecionado,
      arquivo: this.form.value.uploadArquivo,
    };

    this.http.post(apiUrlUpload, payloadUpload, { headers }).subscribe(
      uploadResponse => {
        alert(`Upload do arquivo realizado com sucesso.`);
        // carrega arquivos
        this.getFiles(this.id);

        // **Resetar seleção**
        this.tipoDocumentoSelecionado = '';
        this.arquivoSelecionado = null;

        // **Limpar campo de input**
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      uploadError => {
        console.error(`Erro ao fazer upload do arquivo:`, uploadError);
        alert(`Erro ao fazer upload do arquivo.`);
      }
    );


    // Aqui você chamaria o serviço para enviar para o backend/S3
    console.log('Enviando documento:', this.tipoDocumentoSelecionado, this.arquivoSelecionado.name);


    // Resetar seleção
    this.tipoDocumentoSelecionado = '';
    this.arquivoSelecionado = null;
  }



  selecionarTodosJPG() {
    console.log('Selecionar/Desmarcar todos os arquivos JPG');
  
    const jpgs = this.arquivos.filter(arquivo => arquivo.extension.toLowerCase() === 'jpg').map(arquivo => arquivo.file);
    const tpArquivoJpgs = this.arquivos.filter(arquivo => arquivo.extension.toLowerCase() === 'jpg').map(arquivo => arquivo.key);
  
    if (this.arquivosSelecionados.length === jpgs.length) {
      // Se todos os JPGs estão selecionados, desmarcar todos
      this.arquivosSelecionados = [];
      this.tipoArquivosSelecionados = [];
      console.log('Todos desmarcados:', this.arquivosSelecionados);
    } else {
      // Se nem todos estão selecionados, marcar todos
      this.arquivosSelecionados = jpgs;
      this.tipoArquivosSelecionados = tpArquivoJpgs;
      console.log('Todos selecionados:', this.arquivosSelecionados);
    }
  }
  

  toggleArquivo(arquivo: any) {
    console.log('toggleArquivo');
    if (arquivo.extension.toLowerCase() === 'jpg') {
      console.log('jpg');
      const index = this.arquivosSelecionados.indexOf(arquivo.file);      
      console.log('index %d', index);
      if (index === -1) {
        this.arquivosSelecionados.push(arquivo.file);
        this.tipoArquivosSelecionados.push(arquivo.key)
      } else {
        this.arquivosSelecionados.splice(index, 1);
        this.tipoArquivosSelecionados.splice(index, 1);
      }
    }
  }

  geraPDFCompleto() {
    this.ngZone.run(() => {
      this.gerandoPDFCompleto = true;
    });    
    this.cdr.detectChanges();

    // Filtra apenas arquivos .jpg
    const arquivosJpg = this.arquivos
      .filter((arquivo: any) => arquivo.extension?.toLowerCase() === 'jpg')
      .map((arquivo: any) => arquivo.file); // pega só a chave/identificador do arquivo

    console.log('Arquivos selecionados para PDF:', arquivosJpg);  
    if (!arquivosJpg.length) {
      this.ngZone.run(() => {
        this.gerandoPDFCompleto = false;
      });
      this.cdr.detectChanges();
      console.warn('Nenhum arquivo JPG encontrado.');
      return;
    }

    const body = {
      fileName: this.formData.NOME_DESBRAVADOR,
      fileKeys: arquivosJpg,
      dataNascimento: this.formData.DATA_NASCIMENTO
    };

    console.log('Enviando para API:', body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; pdfUrl: string }>(
      'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/ficha-pdf',
      body,
      { headers }
    ).subscribe(response => {
      this.ngZone.run(() => {
        this.gerandoPDFCompleto = false;
      });
      this.cdr.detectChanges();

      if (response.pdfUrl) {
        window.open(response.pdfUrl, '_blank');
      }
    }, error => {
      this.ngZone.run(() => {
        this.gerandoPDFCompleto = false;
      });
      this.cdr.detectChanges();
      console.error('Erro na requisição:', error);
    });
  }


  gerarPDF() {

    this.ngZone.run(() => {
      this.gerandoPDF = true;
    });    
    this.cdr.detectChanges(); // Força o Angular a atualizar a UI
   

    console.log('Arquivos selecionados para PDF:', this.arquivosSelecionados);
    const body = {
      fileName: this.formData.NOME_DESBRAVADOR, // 'Lucas Pingituro Domingues',
      fileKeys: this.arquivosSelecionados,
      dataNascimento: this.formData.DATA_NASCIMENTO
    };

    console.log(body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    this.http.post<{ message: string; pdfUrl: string }>(
      'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/ficha-pdf',
      body,
      { headers }
    ).subscribe(response => {
      this.ngZone.run(() => {
        this.gerandoPDF = false;
      });
      this.cdr.detectChanges(); // Força o Angular a atualizar a UI
    
      if (response.pdfUrl) {
        window.open(response.pdfUrl, '_blank'); // Aguarda um pouco antes de abrir
        
      }
    }, error => {
      this.ngZone.run(() => {
        this.gerandoPDF = false; // Garantir que o loading some
      });
      this.cdr.detectChanges(); // Força o Angular a atualizar a UI
      console.error('Erro na requisição:', error);
    });
  }


  deleteSelectedFiles(): void {
    if (!this.tipoArquivosSelecionados || this.tipoArquivosSelecionados.length === 0) {
      alert("Nenhum arquivo selecionado para exclusão.");
      return;
    }
  
    const confirmacao = confirm("Todos os arquivos selecionados serão excluídos. Deseja continuar?");
    if (!confirmacao) {
      return;
    }

    this.ngZone.run(() => {
      this.excluindoArquivosSelecionados = true;
    });    
    this.cdr.detectChanges(); // Força o Angular a atualizar a UI

  
    const url = `https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file/delete`;
  
    let deletados = 0;
  
    this.tipoArquivosSelecionados.forEach((tipoArquivo, index) => {
      const payload = {
        idDesbravador: this.id,
        tipoArquivo: tipoArquivo
      };
  
      this.http.post(url, payload).subscribe({
        next: () => {
          deletados++;
          // Se for o último da lista, exibe alerta
          if (deletados === this.tipoArquivosSelecionados.length) {
            this.ngZone.run(() => {
              this.excluindoArquivosSelecionados = false;
            });
            this.cdr.detectChanges();
            this.arquivosSelecionados = [];
            this.tipoArquivosSelecionados = [];
            alert("Arquivos selecionados excluídos com sucesso.");
            this.getFiles(this.id); // Atualiza a lista de arquivos
          }
        },
        error: (error) => {
          console.error(`Erro ao excluir o arquivo: ${tipoArquivo}`, error);
          // Também pode mostrar erro individual, se desejar.
          this.ngZone.run(() => {
            this.excluindoArquivosSelecionados = false;
          });
          this.cdr.detectChanges();
        }
      });
    });
  }
  
  

 /* editImage(arquivo: any) {


    this.currentEditingFile = arquivo;

    // Criar um evento simulado para o cropper
    const fakeEvent = {
      target: {
        files: [] as any[]
      }
    };

    console.log('Editando imagem:', arquivo.link);

    // Criar uma URL da imagem para carregar no cropper
    const xhr = new XMLHttpRequest();
    xhr.open("GET", arquivo.link, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      const blob = xhr.response;
      const file = new File([blob], arquivo.nome, { type: "image/jpeg" });
      fakeEvent.target.files[0] = file;
      this.imageChangedEvent = fakeEvent;
      this.showCropper = true;
    };
    xhr.send();
  }
*/
editImage(arquivo: any) {
  console.log('🟨 Iniciando edição da imagem:', arquivo);
  this.currentEditingFile = arquivo;
  this.showCropper = false; // garante recriação do componente

  fetch(arquivo.link)
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;

        // Forçar recriação do cropper
        this.imageChangedEvent = null;
        this.cdr.detectChanges();

        this.showCropper = true;
        setTimeout(() => {
          this.imageChangedEvent = { target: { files: [] } }; // não será usado
          this.croppedImage = null;

          // Passar a imagem direto como base64
          // Necessário usar [imageBase64] no HTML
          this.imageBase64 = base64;
          this.cdr.detectChanges();
        }, 50);
      };
      reader.readAsDataURL(blob);
    })
    .catch(err => console.error('❌ Erro ao carregar imagem:', err));
}




   async onImageCropped(event:any) {
    console.log('Imagem cortada:', event);
    this.croppedImage = await this.blobToBase64(event.blob);
    console.log('x: ', this.croppedImage);
  }


  


  confirmCrop() {

    console.log('Confirmando crop da imagem');
  if (!this.currentEditingFile || !this.croppedImage) return;
console.log('111');
  const fileName = this.currentEditingFile.nome;
  const keyArquivo = this.currentEditingFile.key;
     console.log('y : ', this.croppedImage);
  // Converter base64 para Blob
  const byteString = atob(this.croppedImage.split(',')[1]);
  const mimeString = this.croppedImage.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], fileName, { type: mimeString });

  // Monta o FormData para enviar
  const formData = new FormData();
  formData.append('arquivo', file);
  formData.append('idDesbravador', this.id);
  formData.append('tipoArquivo', keyArquivo);

  console.log('tipoArquivo', keyArquivo);
  console.log('idDesbravador', this.id);

  // Envia para o backend
/*  this.http.post('https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file', formData)
    .subscribe({
      next: () => {
        // Atualiza tabela para mostrar a imagem cortada
        this.currentEditingFile.preview = this.croppedImage;

        // Fecha cropper
        this.showCropper = false;
        this.croppedImage = null;
        this.currentEditingFile = null;

        // Recarrega arquivos do backend (opcional, se precisar garantir atualização)
        this.getFiles(this.id);
        alert('Imagem cortada e atualizada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao enviar imagem cortada:', err);
        alert('Erro ao atualizar a imagem. Tente novamente.');
      }
    });*/


    ///


     

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Simulação de envio para o servidor
    /*const formData = new FormData();
    formData.append('tipoDocumento', this.tipoDocumentoSelecionado);
    formData.append('arquivo', this.arquivoSelecionado);*/

    const apiUrlUpload   = 'https://yuw8fulryb.execute-api.sa-east-1.amazonaws.com/api/cadastro/documentos/file';
    const payloadUpload = {
      idDesbravador: this.id,
      tipoArquivo: this.currentEditingFile.key,
      arquivo: this.croppedImage,//file,
    };

    this.http.post(apiUrlUpload, payloadUpload, { headers }).subscribe(
      uploadResponse => {
        alert(`Upload do arquivo realizado com sucesso.`);

        // Fecha cropper
        this.showCropper = false;
        this.croppedImage = null;
        this.currentEditingFile = null;

        // carrega arquivos
        this.getFiles(this.id);

        // **Resetar seleção**
        this.tipoDocumentoSelecionado = '';
        this.arquivoSelecionado = null;

        // **Limpar campo de input**
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      uploadError => {
        console.error(`Erro ao fazer upload do arquivo:`, uploadError);
        alert(`Erro ao fazer upload do arquivo.`);
      }
    );
}

aplicarCrop(){
   this.currentEditingFile.preview = this.croppedImage;
   this.imageBase64 = this.croppedImage
}
  cancelCrop() {
    this.showCropper = false;
    this.croppedImage = null;
    this.currentEditingFile = null;
  }

  cropperReady() {
    console.log('Cropper pronto!');
  }

  loadImageFailed() {
    alert('Falha ao carregar a imagem. Verifique o arquivo.');
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Erro ao ler blob'));
      reader.onload = () => resolve(reader.result as string); // data:<mime>;base64,AAAA...
      reader.readAsDataURL(blob);
    });
  }


  rotation: number = 0;
  transform: ImageTransform = {};
  rotateImage(degrees: number): void {

    if (!this.imageBase64) return;
    this.rotateBase64Image(this.imageBase64, degrees).then(rotated => {
      this.imageBase64 = rotated;
      this.transform = { rotate: 0 }; // reset do transform do cropper
    });

    
  }

  private rotateBase64Image(base64: string, degrees: number): Promise<string> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        if (degrees % 180 === 0) {
          canvas.width = img.width;
          canvas.height = img.height;
        } else {
          canvas.width = img.height;
          canvas.height = img.width;
        }
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        resolve(canvas.toDataURL('image/png'));
      };
    });
  }

}


