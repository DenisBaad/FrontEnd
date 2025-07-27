import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { CropperDialogComponent, CropperDialogResult } from '../cropper-dialog/cropper-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-image-control',
  imports: [
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './image-control.component.html',
  styleUrl: './image-control.component.scss'
})
export class ImageControlComponent {
  imageWidth = signal(0);
  imageHeight = signal(0);

  @Input() set width (val: number) {
    this.imageWidth.set(val);
  };

  @Input() set height (val: number) {
    this.imageHeight.set(val);
  };

  @Input() placeholderUrl?: string;
  @Input() imageUrl?: string;
  @Output() imageReady = new EventEmitter<Blob>();
  @Input() showButton: boolean = true;
  @Input() isRounded: boolean = false;
  @Input() hideInputField: boolean = false;

  constructor(){
    effect(() => {
      if(this.croppedImage()){
        this.imageReady.emit(this.croppedImage()?.blob)
      }
    })
  }

  placeholder = computed(() => {
    if (this.placeholderUrl) {
      const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,/;

      if (base64Pattern.test(this.placeholderUrl)) {
        const byteCharacters = atob(this.placeholderUrl.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        return URL.createObjectURL(blob);
      }
      return this.placeholderUrl;
    }
    return `https://placehold.co/${this.imageWidth()}x${this.imageHeight()}`;
  });

  croppedImage = signal<CropperDialogResult | undefined>(undefined);
  imageSource = computed(() => {
    if (this.croppedImage()) {
      return this.croppedImage()?.imageUrl;
    }
    return this.imageUrl || this.placeholder();
  });

  dialog = inject(MatDialog);


  fileSelected(event:any) {
    const file = event.target.files[0];
    if(file) {
      const dialogRef = this.dialog.open(CropperDialogComponent, {
        data: {
          image: file,
          width: 500,
          height: 500
        },
        width: '500px'
      });

      dialogRef.afterClosed().pipe(filter(result => !!result))
      .subscribe((result) => {
        if (result && result.blob) {
          this.croppedImage.set(result);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Image = reader.result as string;

            if (base64Image) {
              localStorage.setItem('imageUrl', base64Image);
              this.imageUrl = base64Image;
              localStorage.setItem('isRounded', JSON.stringify(this.isRounded));
            }
          };
          reader.readAsDataURL(result.blob);
        }
      });
    }
  }
}
