import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormatarMoedaDirective } from '../../../shared/directives/formatarMoedaDirective';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { finalize, forkJoin, Observable, of, Subject, take, tap } from 'rxjs';
import { GetPlanoResponse } from '../../../shared/models/interfaces/responses/planos/GetPlanoResponse';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumStatusFatura } from '../../../shared/models/enums/enumStatusFatura';
import { FaturaService } from '../../../services/fatura.service';
import { ClientesService } from '../../../services/clientes.service';
import { PlanoService } from '../../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatAutocompleteModule,
  ],
  templateUrl: './faturas-form.component.html',
  styleUrl: './faturas-form.component.scss'
})
export class FaturasFormComponent {
  private readonly destroy$: Subject<void> = new Subject<void>();
  form!: FormGroup;
  EDITAR_FATURA = 'Alterar fatura';
  private initialFaturaData: any;
  isLoading = true;
  isPlanoLoading = false;
  filteredOptions!: Observable<GetPlanoResponse[]>;
  private cachedPlano: GetPlanoResponse[] | null = null;
  isClienteLoading = false;
  filteredOptionsCliente!: Observable<ResponseCliente[]>;
  private cachedCliente: ResponseCliente[] | null = null;

  public faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<FaturasFormComponent>, private faturaService: FaturaService, private clienteService: ClientesService, private planoService: PlanoService ,private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.initialFormFatura();
    this.loadPlanoOptions();
    this.loadClienteOptions();
  }
  initialFormFatura(){
    this.form = this.fb.group({
      status: ['', Validators.required],
      inicioVigencia: [null , [Validators.required]],
      fimVigencia: [null , [Validators.maxLength(40)]],
      dataVencimento: [null , [Validators.required]],
      valorTotal: [0, [Validators.required]],
      planoId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      });
      if (this.item.titulo === this.EDITAR_FATURA) {
        this.isLoading = true;
        setTimeout(() => {
        this.initialFaturaData = this.item.fatura;
        this.form.patchValue({
          status: this.item.fatura.status,
          inicioVigencia: this.item.fatura.inicioVigencia,
          fimVigencia: this.item.fatura.fimVigencia,
          dataVencimento: this.item.fatura.dataVencimento,
          valorTotal: this.formatarValorParaExibicao(this.item.fatura.valorTotal),
          planoId: this.item.fatura.planoId,
          clienteId: this.item.fatura.clienteId
        });
        forkJoin([
          this.planoService.getById(this.item.fatura.planoId),
          this.clienteService.getById(this.item.fatura.clienteId)
        ]).pipe(
          take(1),
          tap(([plano, cliente]) => {
            if (plano) {
              this.form.get('planoId')?.setValue(plano);
            }
            if (cliente) {
              this.form.get('clienteId')?.setValue(cliente);
            }
          })
        ).subscribe(() => {
          this.isLoading = false;
        });
      }, 500);
    } else {
      this.isLoading = false;
    }
  }
  // Buscar planos no campo do formulário
  onOptionSelected(event: MatAutocompleteSelectedEvent, controlName: string): void {
    const selectedOption = event.option.value;
    this.form.controls[controlName].setValue(selectedOption);
    this.isPlanoLoading = false;
  }

  displayPlano(option: any): string {
    return option ? `${option.descricao}` : '';
  }

  onBlur(controlName: string): void {
    const control = this.form.controls[controlName];
    const value = control.value;
    if (value && typeof value === 'string') {
      control.setValue(null, { emitEvent: false });
    }
  }

  loadPlanoOptions(): void {
    if (this.cachedPlano) {
      this.filteredOptions = of(this.cachedPlano);
      return;
    }
    this.isPlanoLoading = true;
    this.planoService.Get().pipe(
      tap(response => {
        this.cachedPlano = response;
      }),
      finalize(() => {
        this.isPlanoLoading = false;
      })
    ).subscribe();
  }

  // Buscar empresas no campo do formulário
  onOptionSelectedEmpresa(event: MatAutocompleteSelectedEvent, controlName: string): void {
    const selectedOption = event.option.value;
    this.form.controls[controlName].setValue(selectedOption);
    this.isClienteLoading = false;
  }

  displayCliente(option: any): string {
    return option ? `${option.nome}` : '';
  }

  onBlurCliente(controlName: string): void {
    const control = this.form.controls[controlName];
    const value = control.value;
    if (value && typeof value === 'string') {
      control.setValue(null, { emitEvent: false });
    }
  }

  loadClienteOptions(): void {
    if (this.cachedCliente) {
      this.filteredOptionsCliente = of(this.cachedCliente);
      return;
    }
    this.isClienteLoading = true;
    this.clienteService.getClientes().pipe(
      tap(response => {
        this.cachedCliente = response;
      }),
      finalize(() => {
        this.isClienteLoading = false;
      })
    ).subscribe();
  }

  onClearForm(): void {
    if (this.item.titulo === this.EDITAR_FATURA) {
      this.form.patchValue({
        status: this.initialFaturaData.status,
        inicioVigencia: this.initialFaturaData.inicioVigencia,
        fimVigencia: this.initialFaturaData.fimVigencia,
        dataVencimento: this.initialFaturaData.dataVencimento,
        valorTotal: this.formatarValorParaExibicao(this.initialFaturaData.valorTotal),
        planoId: this.initialFaturaData.planoId,
        clienteId: this.initialFaturaData.clienteId
      });
    } else {
      this.form.patchValue({
        status: '',
        inicioVigencia: '',
        fimVigencia: '',
        dataVencimento: '',
        valorTotal: '',
        planoId: '',
        clienteId: ''
      });
    }
  }
  onSubmitForm(): void {
    const idPlano = this.form.value.planoId ? this.form.value.planoId.id : null;
    const idCliente = this.form.value.clienteId ? this.form.value.clienteId.id : null;
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      formValue.valorTotal = this.ajustaStringMonetaria(formValue.valorTotal);
      formValue.planoId = idPlano;
      formValue.clienteId = idCliente
      if (this.item.titulo === this.EDITAR_FATURA) {
        this.faturaService.Put(formValue, this.item.fatura.id)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.snackBar.open('Fatura alterada com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: () => this.snackBar.open('Erro ao alterar fatura!', 'Fechar', { duration: 2000 }),
          });
      } else {
        this.faturaService.Post(formValue)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.snackBar.open('Fatura cadastrada com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: () => this.snackBar.open('Erro ao cadastrar fatura!', 'Fechar', { duration: 2000 }),
          });
      }
    }
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
