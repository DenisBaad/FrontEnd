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
import { Subject, takeUntil } from 'rxjs';
import { GetPlanoResponse } from '../../shared/models/interfaces/responses/planos/GetPlanoResponse';
import { PlanoService } from '../../services/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanosFormComponent } from './planos-form/planos-form.component';
import { FormatoMoedaPipe } from '../../shared/pipes/formato-moeda.pipe';

@Component({
  selector: 'app-planos-home',
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
  templateUrl: './planos-home.component.html',
  styleUrl: './planos-home.component.scss'
})
export class PlanosHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<GetPlanoResponse>();
  displayedColumns: string[] = ['descricao', 'valorPlano', 'quantidadeUsuarios', 'vigenciaMeses', 'acoes'];
  public planoData!: GetPlanoResponse[] | undefined;
  public isLoading = true;
  ADICIONAR_PLANO = 'Adicionar novo plano';
  EDITAR_PLANO = 'Alterar plano';

  constructor(private planosService: PlanoService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getPlanos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.planoData?.filter(plano => plano.descricao.trim().toLowerCase().includes(value)) || []
  }

  getPlanos() {
    this.isLoading = true;

    this.planosService.Get()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.planoData = response;
        this.isLoading = false;
      },
      error: (err) => {
          console.error('Erro ao buscar planos', err);
          this.isLoading = false;
        }
    })
  }

  public handlePlanoEvent(action: string, plano?: GetPlanoResponse): void {
    if (action === this.ADICIONAR_PLANO) {
      const dialogRef = this.dialog.open(PlanosFormComponent, {
        width: '80%',
        data:
        {
          titulo: action,
        }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === "OK") {
          this.getPlanos();
          this.snackBar.open('Plano cadastrado com sucesso!', 'Fechar', { duration: 2000 });
        }
      });
    } else if (action === this.EDITAR_PLANO) {
        const dialogRef = this.dialog.open(PlanosFormComponent, {
          width: '80%',
          data: {
            titulo: action,
            plano: plano,
           }
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === "OK") {
            this.getPlanos();
            this.snackBar.open('Plano editado com sucesso!', 'Fechar', { duration: 2000 });
          }
        });
      }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


