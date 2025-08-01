import { EnumStatusFatura } from "../../../enums/enumStatusFatura";
import { GetPlanoResponse } from "../planos/GetPlanoResponse";

export interface GetFaturaResponse{
  id?: string;
  clienteId: string;
  status: EnumStatusFatura;
  inicioVigencia: Date;
  fimVigencia: Date;
  dataPagamento: Date;
  dataVencimento: Date;
  valorTotal: number;
  valorDesconto: number;
  valorPagamento: number;
  codBoleto: string;
  idTransacao: string;
  planoId: string;
  planos: GetPlanoResponse [];
}

