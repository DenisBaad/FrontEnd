import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
    selector: '[appFormatarMoeda]',
})
export class FormatarMoedaDirective implements OnInit {
  constructor(private el: ElementRef, private control: NgControl) {}
  ngOnInit() {
    this.format(this.el.nativeElement.value);
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.format(value);
  }
  private format(value: string): void {
    let formattedValue = value.replace(/\D/g, '');
    if (!formattedValue) {
      this.control?.control?.setValue('', { emitEvent: false });
      return;
    }
    formattedValue = (parseInt(formattedValue, 10) / 100).toFixed(2);
    formattedValue = formattedValue.replace('.', ',');
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    formattedValue = `R$ ${formattedValue}`;
    if (this.el?.nativeElement) {
      this.el.nativeElement.value = formattedValue;
    }
    if (this.control?.control) {
      this.control.control.setValue(formattedValue, { emitEvent: false });
    }
  }
}
export function formatMoeda(value: string | number) {
  let stringValue: string;
  if (typeof value === 'number') {
    stringValue = value.toFixed(2);
  } else {
    stringValue = value;
  }
  let formattedValue = stringValue.replace(/[^\d.,]/g, '');
  formattedValue = formattedValue.replace(',', '.');
  let numberValue = parseFloat(formattedValue).toFixed(2);
  formattedValue = numberValue.replace('.', ',');
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  formattedValue = `R$ ${formattedValue}`;
  return formattedValue;
}
