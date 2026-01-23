import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Matricula } from '../matriculas-editar/matricula.model';


    const PAGE_HEIGHT = 297;
    const TOP_MARGIN = 30;
    const BOTTOM_MARGIN = 20;

    let LOGO_BASE64: string | null = null;



    function ensureSpace(doc: jsPDF, y: number, requiredHeight: number): number {
        if (y + requiredHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
            doc.addPage();
            return TOP_MARGIN;
        }
        return y;
    }


    /* =====================================================
    * Tipagem estendida do jsPDF (autoTable)
    * ===================================================== */
    interface JsPdfWithAutoTable extends jsPDF {
        lastAutoTable?: {
            finalY: number;
        };
    }

    async function drawDadosPessoaisComFoto(
        doc: JsPdfWithAutoTable,
        m: Matricula,
        y: number
        ): Promise<number> {

        const startY = y;

        // --- FOTO (direita)
        if (m.fotoUrl) {
            try {
            const imgBase64 = await loadImageAsBase64(m.fotoUrl);

            // cria objeto Image para ler proporção
            const img = new Image();
            img.src = imgBase64;

            await new Promise(resolve => (img.onload = resolve));

            // espaço máximo reservado
            const maxWidth = 40;
            const maxHeight = 45;

            // proporção original
            const ratio = img.width / img.height;

            // calcula tamanho proporcional
            let renderWidth = maxWidth;
            let renderHeight = maxWidth / ratio;

            if (renderHeight > maxHeight) {
            renderHeight = maxHeight;
            renderWidth = maxHeight * ratio;
            }

            // centraliza no espaço da foto
            const x = 150 + (maxWidth - renderWidth) / 2;
            const yFoto = startY + (maxHeight - renderHeight) / 2;

            doc.addImage(imgBase64, 'JPEG', x, yFoto, renderWidth, renderHeight);

            } catch {
            // ignora erro de imagem
            }
        }

        const sexoDescricao =
        m.sexo === 'M'
            ? 'Masculino'
            : m.sexo === 'F'
            ? 'Feminino'
            : '';

        // --- TABELA (esquerda)
        autoTable(doc, {
            startY,
            body: [
            ['Nome Completo', m.nomeCompleto],
            ['Sexo', sexoDescricao],
            ['Data de Nascimento', m.dataNascimento],
            ['Celular', m.celular],
            ['Email', m.email],
            ['Unidade 2025', m.unidade2025],
            //['Unidade 2026', m.unidade2026],
            ['Veio de outro clube', m.veioOutroClube],
            ['Nome do Clube', m.nomeClube],
            ['Associação', m.associacao],
            ].filter(r => r[1]),
            styles: { fontSize: 9 },
            columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 55 },
            1: { cellWidth: 70 },
            },
            margin: { left: 14 },
            tableWidth: 125, // deixa espaço para a foto
        });

        const tableEnd = doc.lastAutoTable?.finalY ?? startY;
        const fotoEnd = startY + 45;

        return Math.max(tableEnd, fotoEnd) + 8;
    }


    export async function buildMatriculaPdf(m: Matricula): Promise<void> {


        if (!LOGO_BASE64) {
            try {
            LOGO_BASE64 = await loadImageAsBase64('/logo.png');
            } catch {
            LOGO_BASE64 = null;
            }
        }

        const menor = isMenorDeIdade(m.dataNascimento);

        const doc = new jsPDF('p', 'mm', 'a4') as JsPdfWithAutoTable;

        let y = TOP_MARGIN;

        y = drawSection(doc, 'DADOS PESSOAIS', y);
        y = await drawDadosPessoaisComFoto(doc, m, y);

        y = drawSection(doc, 'DOCUMENTOS', y);
        y = drawTable(doc, y, [
            ['CPF', m.cpfDoc],
            ['RG', m.rg],
            ['Órgão Expedidor', m.orgaoExpedidor],
            ['Data de Expedição', m.dtExpedicaoRg],
        ], m);

        y = drawSection(doc, 'ENDEREÇO', y);
        y = drawTable(doc, y, [
            ['CEP', m.cep],
            ['Endereço', `${m.endereco}, ${m.numero}`],
            ['Complemento', m.complemento],
            ['Bairro', m.bairro],
            ['Cidade / Estado', `${m.cidade} / ${m.estado}`],
        ], m);

        if (menor) {
            y = drawSection(doc, 'RESPONSÁVEIS', y);
            y = drawTable(doc, y, [
            ['Nome do Pai', m.nomePaiResp],
            ['Celular do Pai', m.celularPai],
            ['Nome da Mãe', m.nomeMaeResp],
            ['Celular da Mãe', m.celularMae],
            ['Responsável Legal', m.nomeResponsavel],
            ['Celular Responsável', m.celularResponsavel],
            ['Grau de Parentesco', m.grauParentesco],
            ], m);
        }

        y = drawSection(doc, 'FICHA DE SAÚDE', y);
        y = drawTable(doc, y, [
            ['Tipo Sanguíneo', m.tipoSanguineo],
            ['Plano de Saúde', m.planoSaude],
            ['Qual Plano', m.qualPlano],
            ['Número da Carteirinha', m.numeroCarteirinha],
            ['Peso', m.peso],
            ['Altura', m.altura],
            ['Alergias', m.manifestacaoAlergia?.join(', ') || 'Nenhuma'],
            ['Outras Alergias', m.outraAlergiaDesc],
            ['Problemas de Saúde Recentes', m.problemasSaudeRecente],
        ], m);

        if (menor) {
            y = drawSection(doc, 'AUTORIZAÇÃO DE SAÍDA', y);
            y = drawTable(doc, y, [
            ['Desbravador', m.nomeDesbravadorSaida],
            ['Responsável', m.nomeResponsavelSaida],
            ['CPF do Responsável', m.cpfResponsavelSaida],
            ['Tipo de Autorização', m.tipoAutorizacaoSaida],
            ['Pessoa Autorizada 1', m.pessoaAutorizada1],
            ['Pessoa Autorizada 2', m.pessoaAutorizada2],
            ['Pessoa Autorizada 3', m.pessoaAutorizada3],
            ], m);
        }

        y = drawSection(doc, 'TERMOS E AUTORIZAÇÕES', y);
        y = drawParagraph(doc, y, buildTextoTermosAutorizacoes(m));

        y = drawSection(doc, 'COMPROMISSO', y);
        y = drawParagraph(doc, y, buildTextoCompromisso(m));

        y = drawSection(doc, 'AUTORIZAÇÃO PARA USO DE IMAGEM', y);
        y = drawParagraph(doc, y, buildTextoAutorizacaoImagem(m));

        y = drawSection(doc, 'AUDITORIA', y);
        y = drawTable(doc, y, [
            ['Criado em', m.createdAt],
            ['IP', m.ipOrigem],
            ['User Agent', m.userAgent],
        ], m);

        const totalPages = doc.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            drawHeaderAtPage(doc, m);
        }

        addFooter(doc);
        doc.save(`matricula_${m.cpfDoc}.pdf`);
    }



    function buildTextoTermosAutorizacoes(m: Matricula): string {
        const menor = isMenorDeIdade(m.dataNascimento);

        let texto = '';

        texto +=
        `
        Consciente dos grandes benefícios recebidos através do Clube de Desbravadores descrito nas páginas anteriores, abdico responsabilizar, em qualquer instância judicial, o(os) responsável(eis) do referido Clube em todos os níveis, bem como a Igreja Adventista do Sétimo Dia, por qualquer dano causado ou sofrido por meu dependente, devido a sua própria atuação.

        Em caso de emergência, autorizo a liderança do clube a tomar as providências de tratamento de saúde que forem necessárias, envolvendo internação hospitalar, anestesia ou cirurgia.

        Declaro ainda que nada omiti na ficha e declaração de saúde, sendo de minha responsabilidade qualquer complicação clínica devido ao preenchimento equivocado ou omissão.
        `;

        if (menor) {
            texto +=
        `

        Eu, ${m.nomeDeclarante}, portador do RG ${m.rgDeclarante}, responsável pelo(a) menor ${m.responsavelAssinatura}, estou ciente das informações citadas e assumo qualquer erro por mim cometido nas declarações acima.
        `;
        } else {
            texto +=
        `

        Eu, ${m.responsavelAssinatura}, portador do RG ${m.rgDeclarante}, estou ciente das informações citadas e assumo qualquer erro por mim cometido nas declarações acima.
        `;
        }

        texto +=
        `

        Concordância: ${m.confirmacaoAutorizacao ? 'SIM' : 'NÃO'}
        `;

        return texto;
    }


    



    function buildTextoCompromisso(m: Matricula): string {
        let texto = '';

        texto +=
        `
        Conheço o sistema de funcionamento do Clube de Desbravadores e me comprometo a atuar em harmonia com seus princípios.

        Comprometo-me a fazer o máximo possível para seguir os princípios do Voto e da Lei do Desbravador, cooperar com os demais membros da direção e desbravadores e obedecer aos regulamentos do Clube de Desbravadores Pioneiros da Colina.

        Assumo responsabilidade pessoal pelas atitudes (minhas e/ou de) ${m.nomeCompromisso}.

        Compromisso assumido: ${m.confirmacaoCompromisso ? 'SIM' : 'NÃO'}
        `;

        return texto;
    }



    function drawSection(doc: jsPDF, title: string, y: number): number {
        const requiredHeight = 18;
        y = ensureSpace(doc, y, requiredHeight);

        y += 6;

        doc.setDrawColor(180);
        doc.setLineWidth(0.3);
        doc.line(14, y, 196, y);

        y += 5;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, y);
        doc.setFont('helvetica', 'normal');

        return y + 5;
    }


    function addFooter(doc: jsPDF) {
        const pageCount = doc.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(120);

            doc.text(
            `${i}/${pageCount}`,
            105,
            PAGE_HEIGHT - 10,
            { align: 'center' }
            );
        }
    }


    function drawHeaderAtPage(doc: jsPDF, m: Matricula) {
        const HEADER_HEIGHT = 22;

        doc.setDrawColor(180);
        doc.setLineWidth(0.3);
        doc.line(14, HEADER_HEIGHT, 196, HEADER_HEIGHT);

        if (LOGO_BASE64) {
            doc.addImage(LOGO_BASE64, 'PNG', 14, 4, 14, 14);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Clube de Desbravadores', 35, 9);

        doc.setFontSize(13);
        doc.text('Pioneiros da Colina', 35, 15);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(
            `${m.nomeCompleto} — CPF: ${m.cpfDoc}`,
            35,
            20
        );
    }


function drawTable(
  doc: JsPdfWithAutoTable,
  y: number,
  rows: string[][],
  m: Matricula
): number {
  autoTable(doc, {
    startY: y,
    body: rows.filter(r => r[1]),
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
    },
    margin: {
      left: 14,
      right: 14,
      top: TOP_MARGIN, // reserva espaço para o header
    },    
  });

  return (doc.lastAutoTable?.finalY ?? y) + 6;
}



function buildTextoAutorizacaoImagem(m: Matricula): string {
    const menor = isMenorDeIdade(m.dataNascimento);

    let texto = '';

    if (menor) {
        texto +=
    `
    Eu, ${m.nomeResponsavelImagem}, na qualidade de responsável pelo(a) menor: ${m.nomeDesbravadorImagem},
    membro inscrito no Clube de Desbravadores Pioneiros da Colina UNASP-SP.

    `;
    } else {
        texto +=
    `
    Eu, ${m.nomeDesbravadorImagem}, membro inscrito no Clube de Desbravadores Pioneiros da Colina UNASP-SP.

    `;
    }

    texto +=
    `A presente autorização é concedida a título gratuito, abrangendo o uso da imagem em todo território nacional e no exterior, das seguintes formas: (I) folhetos em geral (encartes, mala direta, catálogo, etc.); (II) folder de apresentação; (III) anúncios em revistas; (IV) home page; (V) cartazes; (VI) mídia eletrônica (painéis, vídeo, televisão, rádio, Facebook, Instagram, WhatsApp, YouTube, Twitter e demais mídias sociais), bem como fotos e documentos, respeitadas as diretrizes fixadas no Estatuto da Criança e do Adolescente.

    Fica ainda autorizada, de livre e espontânea vontade, para os mesmos fins, a cessão dos direitos de veiculação das imagens, não recebendo para tanto qualquer tipo de remuneração.

    Por esta ser a expressão da minha vontade, declaro que autorizo e que não caberá, em tempo algum, qualquer reclamação, indenização ou pagamento pelo uso da imagem, sendo a presente autorização feita de modo gratuito e permanente.

    Declaro que todas as informações do formulário de inscrição são verdadeiras, estou ciente das informações citadas e assumo qualquer erro por mim cometido nas declarações acima.

    Autorização aceita: ${m.confirmacaoAutorizacaoImagem ? 'SIM' : 'NÃO'}
    `;

    return texto;
    }


function isMenorDeIdade(dataNascimento: string): boolean {
  if (!dataNascimento) return false;

  const nascimento = new Date(dataNascimento);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade < 18;
}


function normalizeText(text: string): string {
  return text
    .replace(/\r/g, '')           // remove CR
    .replace(/\n\s+\n/g, '\n\n')  // remove indentação entre parágrafos
    .replace(/^\s+|\s+$/g, '')    // trim geral
}

function drawParagraph(doc: jsPDF, y: number, rawText: string): number {
  doc.setFontSize(9);

  const text = normalizeText(rawText);
  const lines = doc.splitTextToSize(text, 180);

  const lineHeight = 4.5;
  const padding = 4;
  const height = lines.length * lineHeight + padding * 2;

  y = ensureSpace(doc, y, height);

  doc.setFillColor(245, 245, 245);
  doc.rect(12, y - padding, 186, height, 'F');

  doc.text(lines, 14, y);

  return y + height + 3;
}





/* =====================================================
 * Utils
 * ===================================================== */

async function loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Erro ao carregar imagem');

  const blob = await response.blob();
  const img = await createImageBitmap(blob);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não suportado');

  // 🔴 FUNDO BRANCO (resolve o problema)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // desenha a imagem por cima
  ctx.drawImage(img, 0, 0);

  // agora sim pode virar JPEG sem ficar preto
  return canvas.toDataURL('image/jpeg', 0.95);
}


