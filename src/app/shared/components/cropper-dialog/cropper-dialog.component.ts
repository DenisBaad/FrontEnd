import { Component, inject, signal } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export type CropperDialogData = {
  image: File;
  width: number;
  height: number;
}

export type CropperDialogResult = {
  blob: Blob;
  imageUrl: string;
}

@Component({
  selector: 'app-cropper-dialog',
  imports: [
    ImageCropperComponent,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './cropper-dialog.component.html',
  styleUrl: './cropper-dialog.component.scss'
})
export class CropperDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  result = signal<CropperDialogResult | undefined>(undefined);

  imageCropped(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;
    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }
}
