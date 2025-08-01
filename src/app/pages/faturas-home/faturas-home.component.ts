import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatoMoedaPipe } from '../../shared/pipes/formato-moeda.pipe';
import { Subject, takeUntil } from 'rxjs';
import { GetFaturaResponse } from '../../shared/models/interfaces/responses/faturas/GetFaturaResponse';
import { GetPlanoResponse } from '../../shared/models/interfaces/responses/planos/GetPlanoResponse';
import { ResponseCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumStatusFatura } from '../../shared/models/enums/enumStatusFatura';
import { FaturaService } from '../../services/fatura.service';
import { PlanoService } from '../../services/plano.service';
import { ClientesService } from '../../services/clientes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaturasFormComponent } from './faturas-form/faturas-form.component';

@Component({
  selector: 'app-faturas-home',
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
    FormatoMoedaPipe
  ],
  templateUrl: './faturas-home.component.html',
  styleUrl: './faturas-home.component.scss'
})
export class FaturasHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<GetFaturaResponse>();
  displayedColumns: string[] = ['status', 'inicioVigencia', 'fimVigencia', 'valorTotal', 'planoId', 'clienteId', 'acoes'];
  public faturaData!: GetFaturaResponse[] | undefined;
  public planosList: Array<GetPlanoResponse>= [];
  public clientesList: Array<ResponseCliente>= [];
  ADICIONAR_FATURA = 'Adicionar nova fatura';
  EDITAR_FATURA = 'Alterar fatura';

  public faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(private faturaService: FaturaService, private planoService: PlanoService, private clienteService:ClientesService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getPlanos();
    this.getClientes();
    this.getFaturas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.faturaData?.filter(fatura => fatura.codBoleto.trim().toLowerCase().includes(value)) || []
  }

  public getPlanoDescricao(planoId: string): string {
    const plano = this.planosList.find(cat => cat.id === planoId);
    return plano ? plano.descricao : 'Plano não encontrada';
  }
  public getNomeCliente(clienteId: string): string {
    const cliente = this.clientesList.find(cat => cat.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrada';
  }

  public getPlanos(): void {
    this.planoService.Get()
    .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
          this.planosList = response;
        },
        error: (err) => {
          console.error('Erro ao buscar planos', err);
        }
      })
  }

  public getClientes(): void {
    this.clienteService.getClientes()
      .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
          this.clientesList = response;
        },
        error: (err) => {
          console.error('Erro ao buscar clientes', err);
        }
      })
  }

  getFaturas(idPlano: string = '', clienteId: string = ''): void {
    this.faturaService.Get(idPlano, clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response;
        },
        error: (err) => {
          console.error('Erro ao buscar faturas', err);
        }
      });
  }

  public handleFaturaEvent(action: string, fatura?: GetFaturaResponse): void {
      if (action === this.ADICIONAR_FATURA) {
        const dialogRef = this.dialog.open(FaturasFormComponent, {
          width: '80%',
          data:
          {
            titulo: action,
          }
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === "OK") {
            this.getFaturas();
            this.snackBar.open('Fatura cadastrada com sucesso!', 'Fechar', { duration: 2000 });
          }
        });
      } else if (action === this.EDITAR_FATURA) {
          const dialogRef = this.dialog.open(FaturasFormComponent, {
            width: '80%',
            data: {
              titulo: action,
              fatura: fatura,
             }
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result === "OK") {
              this.getFaturas();
              this.snackBar.open('Fatura editada com sucesso!', 'Fechar', { duration: 2000 });
            }
          });
        }
  }

  public getStatusLabel(status?: EnumStatusFatura): string {
    const option = this.faturaStatusOptions.find(option => option.value === status);
    return option ? option.label : '-';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
