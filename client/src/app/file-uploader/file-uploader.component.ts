import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() imagePath: string = '';
  @Output('emit-path') imagePreview = new EventEmitter<File>();

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile === null) return;
    this.imagePath = this.fileUrl;
    this.imagePreview.emit(this.selectedFile);
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
