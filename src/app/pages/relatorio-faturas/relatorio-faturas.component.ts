import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { Subject, takeUntil, tap } from 'rxjs';
import { ResponseCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumStatusFatura } from '../../shared/models/enums/enumStatusFatura';
import { FaturaService } from '../../services/fatura.service';
import { ClientesService } from '../../services/clientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-relatorio-faturas',
  imports: [
    MatCardModule,
    CommonModule,
    MatProgressBarModule,
    SafePipe,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule,
    MatIconModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './relatorio-faturas.component.html',
  styleUrl: './relatorio-faturas.component.scss'
})
export class RelatorioFaturasComponent {
  private readonly destroy$: Subject<void> = new Subject();
  pdfUrl: string = '';
  loading: boolean = false;
  form: FormGroup;
  clientesDatas: ResponseCliente[] = [];
  clientesFiltro: string = '';
  clientesFiltrados: ResponseCliente[] = [];
  isMobile: boolean = false;

  public faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(private fb: FormBuilder, private faturasService: FaturaService, private clientesService: ClientesService,  private snackBar: MatSnackBar) {
        this.form = this.fb.group({
        dataAbertura: [null],
        dataFechamento: [null],
        status: [null],
        clientesSelecionados: [[]]
      });

      this.getClientes();
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  public carregarRelatorio(): void {
    const dataAbertura = this.form.get('dataAbertura')?.value;
    const dataFechamento = this.form.get('dataFechamento')?.value;
    const status = this.form.get('status')?.value;
    const clientesSelecionados: string[] = this.form.get('clientesSelecionados')?.value || [];

    if (!dataAbertura || !dataFechamento) {
      this.snackBar.open(
        'Preencha a data de abertura e a data de fechamento antes de gerar o relatório.',
        'Fechar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-warning']
        }
      );
      return;
    }

    this.loading = true;
    const usuarioNome = decodeURIComponent(this.getCookie('USUARIO_NOME') || 'Usuário Desconhecido');

    this.faturasService.getRelatorioFaturas(usuarioNome, dataAbertura, dataFechamento, status, clientesSelecionados).pipe(takeUntil(this.destroy$)).subscribe({
      next: (fileUrl) => {
        this.pdfUrl = fileUrl;
        this.loading = false;

        if (this.isMobile) {
            // Em celular, faz o download automático
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'relatorio_faturas.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.open(fileUrl, '_blank');
          }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  public getClientes(): void {
    this.clientesService.getClientes()
    .pipe(takeUntil(this.destroy$),
    tap((response) => {
      this.clientesDatas = response;
      this.clientesFiltrados = response;
      })
    )
    .subscribe();
  }

  public filtrarClientes(): void {
      const filtro = this.clientesFiltro.toLowerCase();
      this.clientesFiltrados = this.clientesDatas.filter(cliente =>
        cliente.nome.toLowerCase().includes(filtro));
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
