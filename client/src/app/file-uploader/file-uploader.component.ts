import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../_models/recipe.model';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {
  selectedFile: File | null = null;
  progress = 0;
  type: 'success' | 'info' | 'warning' | 'danger' = 'info';
  imagePath: string = '';


  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile === null) return;
    this.imagePath = this.fileUrl;
  }

  get sizeInMb() {
    return this.selectedFile
      ? (this.selectedFile.size / Math.pow(10, 6)).toFixed(2) + ' MB'
      : 'null';
  }

  get fileUrl() {
    if (this.selectedFile === null) return 'null';
    return URL.createObjectURL(this.selectedFile);
  }
}
