import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumTipoCliente } from '../../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../../shared/models/enums/enumStatusCliente';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-clientes-form',
  imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatInputModule,
      ReactiveFormsModule,
      FlexLayoutModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatFormField,
      MatTooltipModule,
      MatDatepickerModule
    ],
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.scss'
})
export class ClientesFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  clienteForm!: FormGroup;
  clienteData: ResponseCliente | undefined;
  isLoading = true;

  clienteTipo = [
    { label: 'Fisica', value: EnumTipoCliente.Fisica },
    { label: 'Juridica', value: EnumTipoCliente.Juridica }
  ]

  clienteStatus = [
    { label: 'Ativo', value: EnumStatusCliente.Ativo},
    { label: 'Inativo', value: EnumStatusCliente.Inativo},
  ]

  constructor(private fb: FormBuilder, private clientesService: ClientesService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<ClientesFormComponent>){}

  ngOnInit(): void {
    this.formCliente();
  }

  formCliente(){
    this.clienteForm = this.fb.group({
      codigo: [null, Validators.required],
      tipo: [null, Validators.required],
      cpfCnpj: [null, Validators.required],
      status: [EnumStatusCliente.Ativo, Validators.required],
      nome: [null, Validators.required],
      identidade: [null],
      orgaoExpedidor: [null],
      dataNascimento: ['', Validators.required],
      nomeFantasia: [null],
    })
    if (this.item.cliente) {
      this.isLoading = true;
      setTimeout(() => {
      this.clienteForm.patchValue({
        codigo: this.item.cliente.codigo,
        tipo: this.item.cliente.tipo,
        cpfCnpj: this.item.cliente.cpfCnpj,
        status: this.item.cliente.status,
        nome: this.item.cliente.nome,
        identidade: this.item.cliente.identidade,
        orgaoExpedidor: this.item.cliente.orgaoExpedidor,
        dataNascimento: this.item.cliente.dataNascimento,
        nomeFantasia: this.item.cliente.nomeFantasia
      });
      this.isLoading = false;
    }, 500);
   } else {
    this.isLoading = false;
   }
  }

  buttonResetOrCharge(){
    if (this.item.cliente) {
      this.clienteForm.patchValue({
        codigo: this.item.cliente.codigo,
        tipo: this.item.cliente.tipo,
        cpfCnpj: this.item.cliente.cpfCnpj,
        status: this.item.cliente.status,
        nome: this.item.cliente.nome,
        identidade: this.item.cliente.identidade,
        orgaoExpedidor: this.item.cliente.orgaoExpedidor,
        dataNascimento: this.item.cliente.dataNascimento,
        nomeFantasia: this.item.cliente.nomeFantasia
      })
    } else {
      this.clienteForm.reset();
    }
  }

  save() {
    if (this.clienteForm.valid) {
      const formValue = { ...this.clienteForm.value };

      if (this.item.cliente){
        this.clientesService.putCliente(this.item.cliente.id, formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Cliente editado com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: (err) => {
              const message = this.getErrorMessage(err);
              this.snackBar.open(message, 'Fechar', { duration: 5000 });
          },
          });
      } else {
        this.clientesService.postCliente(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 2000 });
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

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
