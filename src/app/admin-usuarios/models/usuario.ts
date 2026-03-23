export interface Usuario {
  username: string;
  email: string;
  cpf?: string;
  telefone?: string;
  perfil: 'ADMIN' | 'USER';
  ativo: boolean;
  status: string;
}