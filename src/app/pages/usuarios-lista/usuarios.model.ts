export interface Usuario {
  sub: string;
  email: string;
  nome: string;
  ativo: boolean;
  grupos: string[];
}