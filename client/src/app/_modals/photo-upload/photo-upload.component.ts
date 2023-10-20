import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from 'src/app/_models/member';
import { PhotoUploadService } from 'src/app/_services/photo-upload.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
})
export class PhotoUploadComponent {
  modalRef?: BsModalRef;
  @Input() user!: Member;
  constructor(
    private modalService: BsModalService,
    private photoUploadService: PhotoUploadService
  ) {}

  showEditPhoto(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  uploadPhoto(event: File) {
    this.photoUploadService.uploadMemberPhoto(event).subscribe({
      next: (photo) => {
        console.log(photo);
      },
    });
  }
}
