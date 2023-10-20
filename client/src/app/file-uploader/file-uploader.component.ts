import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output('on-selected-file') imagePreview = new EventEmitter<File>();

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

  uploadFile() {
    if (this.selectedFile) this.imagePreview.emit(this.selectedFile);
  }
}
