import { EnumStatusCliente } from "../../../enums/enumStatusCliente";
import { EnumTipoCliente } from "../../../enums/enumTipoCliente";

export interface ResponseCliente {
  id: string;
  codigo: number;
  tipo: EnumTipoCliente;
  cpfCnpj: string;
  status: EnumStatusCliente;
  nome: string;
  identidade?: string;
  orgaoExpedidor?: string;
  dataNascimento?: Date;
  nomeFantasia?: string;
  contato: string;
}
