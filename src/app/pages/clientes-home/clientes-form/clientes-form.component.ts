import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumTipoCliente } from '../../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../../shared/models/enums/enumStatusCliente';
import { RequestCreateCliente } from '../../../shared/models/interfaces/requests/clientes/RequestCreateCliente';
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
      dataNascimento: [''],
      nomeFantasia: [null],
    })
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
      if (this.item.cliente?.id) {
        const request: any = {
          id: this.item.cliente.id,
          codigo: this.clienteForm.value.codigo as number,
          tipo: this.clienteForm.value.tipo as EnumTipoCliente,
          cpfCnpj: this.clienteForm.value.cpfCnpj as string,
          status: this.clienteForm.value.status as EnumStatusCliente,
          nome: this.clienteForm.value.nome as string,
          identidade: this.clienteForm.value.identidade as string,
          orgaoExpedidor: this.clienteForm.value.orgaoExpedidor as string,
          dataNascimento: this.clienteForm.value.dataNascimento as Date,
          nomeFantasia: this.clienteForm.value.nomeFantasia as string
        };

        this.clientesService.putCliente(this.item.cliente.id, request)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Cliente editado com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: () => {
              this.snackBar.open('Erro ao editar cliente!', 'Fechar', { duration: 2000 });
            }
          });

      } else {
        const request: RequestCreateCliente = {
          codigo: this.clienteForm.value.codigo as number,
          tipo: this.clienteForm.value.tipo as EnumTipoCliente,
          cpfCnpj: this.clienteForm.value.cpfCnpj as string,
          status: this.clienteForm.value.status as EnumStatusCliente,
          nome: this.clienteForm.value.nome as string,
          identidade: this.clienteForm.value.identidade as string,
          orgaoExpedidor: this.clienteForm.value.orgaoExpedidor as string,
          dataNascimento: this.clienteForm.value.dataNascimento as Date,
          nomeFantasia: this.clienteForm.value.nomeFantasia as string,
        };

        this.clientesService.postCliente(request)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 2000 });
              this.dialogRef.close('OK');
            },
            error: () => {
              this.snackBar.open('Erro ao cadastrar cliente!', 'Fechar', { duration: 2000 });
            }
          });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
