import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'formatoMoeda'
})
export class FormatoMoedaPipe implements PipeTransform {
  transform(value: string | number): string {
    if (value == null) return '';
    let stringValue = typeof value === 'number' ? value.toFixed(2) : value;
    let formattedValue = stringValue.replace(/[^\d.,]/g, '');
    formattedValue = formattedValue.replace(',', '.');
    const numberValue = parseFloat(formattedValue).toFixed(2);
    formattedValue = numberValue.replace('.', ',');
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${formattedValue}`;
  }
}


