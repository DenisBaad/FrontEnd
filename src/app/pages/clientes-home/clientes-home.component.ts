import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ClientesService } from '../../services/clientes.service';
import { ResponseCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumTipoCliente } from '../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../shared/models/enums/enumStatusCliente';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';

@Component({
  selector: 'app-clientes-home',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss'],
})
export class ClientesHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['codigo', 'tipo', 'cpfCnpj', 'status', 'nome', 'identidade', 'orgaoExpedidor', 'dataNascimento', 'nomeFantasia', 'acoes'];
  dataSource = new MatTableDataSource<ResponseCliente>();
  clienteData: ResponseCliente[] | undefined;
  public isLoading = true;
  ADICIONAR_CLIENTE = 'Adicionar novo cliente';
  EDITAR_CLIENTE = 'Alterar cliente';
  DELETAR_CLIENTE = 'Deletar cliente';
  EnumStatusCliente = EnumStatusCliente;

  constructor(private clientesService: ClientesService, private snackBar: MatSnackBar, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getClientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getClientes() {
    this.isLoading = true;

    this.clientesService.getClientes()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.clienteData = response;
        this.isLoading = false;
      },
      error: (err) => {
          console.error('Erro ao buscar clientes', err);
          this.isLoading = false;
        }
    })
  }

  tipoCliente(tipo: EnumTipoCliente) {
    const tipos = {
      [EnumTipoCliente.Fisica]: 'Fisica',
      [EnumTipoCliente.Juridica]: 'Juridica'
    }
    return tipos [tipo]
  }

  statusCliente(status: EnumStatusCliente) {
    const statuss = {
      [EnumStatusCliente.Ativo]: 'Ativo',
      [EnumStatusCliente.Inativo]: 'Inativo'
    }
    return statuss [status]
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.clienteData?.filter(cliente => cliente.nome.trim().toLowerCase().includes(value)) || []
  }

  handleClienteEvent(action: string, cliente?: ResponseCliente): void {
    switch (action) {
      case this.ADICIONAR_CLIENTE: {
        const dialogRef = this.dialog.open(ClientesFormComponent, {
          width: '80%',
          data: {
            titulo: action,
          }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
          if (result === 'OK') {
            this.getClientes();
            this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 2000 });
          }
        });
        break;
      }

      case this.EDITAR_CLIENTE: {
        const dialogRef = this.dialog.open(ClientesFormComponent, {
          width: '80%',
          data: {
            titulo: action,
            cliente: cliente,
          }
        });

        dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
          if (result === 'OK') {
            this.getClientes();
            this.snackBar.open('Cliente editado com sucesso!', 'Fechar', { duration: 2000 });
          }
        });
        break;
      }
    }
  }

  ativarInativarCliente(id: string) {
    this.clientesService.ativarInativarCliente(id)
    .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Status do cliente alterado com sucesso!', 'Sucesso', { duration: 2000 });
          this.getClientes();
        },
        error: () => {
          this.snackBar.open('Erro ao alterar cliente!', 'Erro', { duration: 2000 });
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
