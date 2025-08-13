import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormatarMoedaDirective } from '../../../shared/directives/formatarMoedaDirective';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Subject, take, takeUntil } from 'rxjs';
import { GetPlanoResponse } from '../../../shared/models/interfaces/responses/planos/GetPlanoResponse';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumStatusFatura } from '../../../shared/models/enums/enumStatusFatura';
import { FaturaService } from '../../../services/fatura.service';
import { ClientesService } from '../../../services/clientes.service';
import { PlanoService } from '../../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-faturas-form',
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    FormatarMoedaDirective,
    MatSelectModule,
    MatDatepickerModule,
    MatFormField,
    MatIconModule
  ],
  templateUrl: './faturas-form.component.html',
  styleUrl: './faturas-form.component.scss'
})
export class FaturasFormComponent {
  private readonly destroy$: Subject<void> = new Subject<void>();
  form!: FormGroup;
  isLoading = true;
  planos: GetPlanoResponse[] = [];
  clientes: ResponseCliente[] = [];

  public faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<FaturasFormComponent>, private faturaService: FaturaService, private clienteService: ClientesService, private planoService: PlanoService , private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initialFormFatura();
    this.getPlanos();
    this.getClientes();
  }

  initialFormFatura(){
    this.form = this.fb.group({
      status: ['', Validators.required],
      inicioVigencia: [null , [Validators.required]],
      fimVigencia: [null , [Validators.maxLength(40), Validators.required]],
      dataVencimento: [null , [Validators.required]],
      valorTotal: [null, [Validators.required]],
      planoId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      });
      if (this.item.fatura) {
        this.isLoading = true;
        setTimeout(() => {
        this.form.patchValue({
          status: this.item.fatura.status,
          inicioVigencia: this.item.fatura.inicioVigencia,
          fimVigencia: this.item.fatura.fimVigencia,
          dataVencimento: this.item.fatura.dataVencimento,
          valorTotal: this.formatarValorParaExibicao(this.item.fatura.valorTotal),
          planoId: this.item.fatura.planoId,
          clienteId: this.item.fatura.clienteId
        });
        this.isLoading = false;
      }, 500);
    } else {
      this.isLoading = false;
    }
  }

  getPlanos(): void {
    this.planoService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.planos = response;
        },
        error: (err) => {
          console.error('Erro ao buscar planos', err);
        }
      });
  }

  getClientes(): void {
    this.clienteService.getClientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clientes = response;
        },
        error: (err) => {
          console.error('Erro ao buscar clientes', err);
        }
      });
  }

  onClearForm(): void {
    if (this.item.fatura) {
      this.form.patchValue({
        status: this.item.fatura.status,
        inicioVigencia: this.item.fatura.inicioVigencia,
        fimVigencia: this.item.fatura.fimVigencia,
        dataVencimento: this.item.fatura.dataVencimento,
        valorTotal: this.formatarValorParaExibicao(this.item.fatura.valorTotal),
        planoId: this.item.fatura.planoId,
        clienteId: this.item.fatura.clienteId
      });
    } else {
      this.form.reset();
    }
  }

  onSubmitForm(): void {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      formValue.valorTotal = this.ajustaStringMonetaria(formValue.valorTotal);
      formValue.planoId = this.form.value.planoId ?? null;
      formValue.clienteId = this.form.value.clienteId ?? null;

      if (this.item.fatura) {
        this.faturaService.Put(formValue, this.item.fatura._id)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.snackBar.open('Fatura alterada com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: (err) => {
                const message = this.getErrorMessage(err);
                this.snackBar.open(message, 'Fechar', { duration: 5000 });
            },
          });
      } else {
        this.faturaService.Post(formValue)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.snackBar.open('Fatura cadastrada com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: (err) => {
                const message = this.getErrorMessage(err);
                this.snackBar.open(message, 'Fechar', { duration: 5000 });
            },
          });
      }
    }
  }

  private getErrorMessage(err: any): string {
    if (err?.error?.messages && Array.isArray(err.error.messages)) {
      const lista = err.error.messages.map((el: string) => `* ${el}`).join('\n');
      return 'Erros encontrados:\n' + lista;
    } else if (err?.error?.message) {
      return err.error.message;
    }
    return 'Erro desconhecido. Detalhes indisponíveis.';
  }

  ajustaStringMonetaria(val:any) : string{
    return val.replace(/R\$/g, '') // Remove "R$"
    .replace(/\s+/g, '') // Remove espaços
    .replace(/\./g, '') // Remove o separador de milhar (ponto)
    .replace(/,/g, '.'); // Substitui vírgula por ponto
  }

  formatarValorParaExibicao(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
