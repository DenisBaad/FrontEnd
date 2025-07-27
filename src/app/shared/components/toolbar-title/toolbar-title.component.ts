import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar-title',
  imports: [
    CommonModule,
    MatToolbarModule
  ],
  templateUrl: './toolbar-title.component.html',
  styleUrl: './toolbar-title.component.scss'
})
export class ToolbarTitleComponent {
  @Input() title: string = "";
  iconFa = '';
  iconMat = '';
  @Input()
  set icon(value: string){
    value.includes('fa-') ? this.iconFa = value : this.iconMat = value
  }
}
