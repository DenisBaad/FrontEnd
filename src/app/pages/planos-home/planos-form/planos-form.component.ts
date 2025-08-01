import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject, take } from 'rxjs';
import { PlanoService } from '../../../services/plano.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormatarMoedaDirective } from '../../../shared/directives/formatarMoedaDirective';

@Component({
  selector: 'app-planos-form',
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    FormatarMoedaDirective
  ],
  templateUrl: './planos-form.component.html',
  styleUrl: './planos-form.component.scss'
})
export class PlanosFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  form!: FormGroup;
  EDITAR_PLANO = 'Alterar plano';
  private initialPlanoData: any;
  isLoading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<PlanosFormComponent>, private planoService: PlanoService, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      valorPlano: [0, [Validators.required, Validators.maxLength(40)]],
      quantidadeUsuarios: [0, Validators.maxLength(40)],
      vigenciaMeses: [0, Validators.required],
    });
    if (this.item.titulo === this.EDITAR_PLANO) {
      this.isLoading = true;
      setTimeout(() => {
      this.initialPlanoData = this.item.plano;
      this.form.patchValue({
        descricao: this.item.plano.descricao,
        valorPlano: this.formatarValorParaExibicao(this.item.plano.valorPlano),
        quantidadeUsuarios: this.item.plano.quantidadeUsuarios,
        vigenciaMeses: this.item.plano.vigenciaMeses,
      });
      this.isLoading = false;
    }, 500);
  } else {
    this.isLoading = false;
  }
}

onClearForm(): void {
  if (this.item.titulo === this.EDITAR_PLANO) {
    this.form.patchValue({
      descricao: this.initialPlanoData.descricao,
      valorPlano: this.formatarValorParaExibicao(this.initialPlanoData.valorPlano),
      quantidadeUsuarios: this.initialPlanoData.quantidadeUsuarios,
      vigenciaMeses: this.initialPlanoData.vigenciaMeses,
    });
  } else {
    this.form.patchValue({
      descricao: '',
      valorPlano: '',
      quantidadeUsuarios: '',
      vigenciaMeses: '',
    });
  }
}

onSubmitForm(): void {
  if (this.form.valid) {
    const formValue = { ...this.form.value };
    formValue.valorPlano = this.ajustaStringMonetaria(formValue.valorPlano);
    if (this.item.titulo === this.EDITAR_PLANO) {
      this.planoService.Put(formValue, this.item.plano.id)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.snackBar.open('Plano alterado com sucesso!', 'Fechar', { duration: 2000 });
            this.dialogRef.close('OK');
          },
          error: () => this.snackBar.open('Erro ao alterar plano!', 'Fechar', { duration: 2000 }),
        });
    } else {
      this.planoService.Post(formValue)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.snackBar.open('Plano cadastrado com sucesso!', 'Fechar', { duration: 2000 });
            this.dialogRef.close('OK');
          },
          error: () => this.snackBar.open('Erro ao cadastrar plano!', 'Fechar', { duration: 2000 }),
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
