import { EnumStatusFatura } from "../../../enums/enumStatusFatura";

export interface RequestFatura {
  clienteId: string;
  status: EnumStatusFatura;
  inicioVigencia: Date;
  fimVigencia: Date;
  dataVencimento: Date;
  valorTotal: number;
  planoId: string;
}
