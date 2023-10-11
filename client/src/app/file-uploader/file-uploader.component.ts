import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

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
  @Output('preview-event') imagePreviewEvent = new EventEmitter<string>();

  onFileChanged(event: any) {
    this.progress = 50;
    this.selectedFile = event.target.files[0];
    if (this.selectedFile === null) return;
    this.imagePath = this.fileUrl;
    this.progress = 100;
    this.type = 'success';
    this.imagePreviewEvent.emit(this.imagePath);
  }

  get sizeInMb() {
    return this.selectedFile
      ? this.selectedFile.size / Math.pow(10, 6) + ' Mbytes'
      : 'null';
  }

  get fileUrl() {
    if (this.selectedFile === null) return 'null';
    return URL.createObjectURL(this.selectedFile);
  }
}
