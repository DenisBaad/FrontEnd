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
import { EnumStatusFatura } from '../../shared/models/enums/enumStatusFatura';
import { FaturaService } from '../../services/fatura.service';
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
  displayedColumns: string[] = ['status', 'inicioVigencia', 'fimVigencia', 'valorTotal', 'plano', 'cliente', 'acoes'];
  public faturaData!: GetFaturaResponse[] | undefined;
  public isLoading = true;
  ADICIONAR_FATURA = 'Adicionar nova fatura';
  EDITAR_FATURA = 'Alterar fatura';

  public faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(private faturaService: FaturaService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getFaturas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.faturaData?.filter(fatura => {
      const nomeCliente = fatura.cliente?.nome?.toLowerCase() ?? '';
      return nomeCliente.includes(value);
    }) || [];
  }

  public getPlanoDescricao(fatura: GetFaturaResponse): string {
    return fatura.plano?.descricao ?? 'Plano não encontrado';
  }

  public getNomeCliente(fatura: GetFaturaResponse): string {
    return fatura.cliente?.nome ?? 'Cliente não encontrado';
  }

  getFaturas(): void {
    this.isLoading = true;

    this.faturaService.Get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response;
          this.faturaData = response;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar faturas', err);
          this.isLoading = false;
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
