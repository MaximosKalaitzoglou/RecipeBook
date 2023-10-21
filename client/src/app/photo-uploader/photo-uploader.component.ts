import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from '../_models/member';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MemberService } from '../_services/member.service';
import { take } from 'rxjs';
import { Photo } from '../_models/photo';
import { faUpload, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.css'],
})
export class PhotoUploaderComponent {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  apiUrl = environment.apiUrl;
  user: User | null = null;

  faUpload = faUpload;
  faBan = faBan;
  faTrash = faTrash;

  constructor(
    private accountService: AccountService,
    private membersService: MemberService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(event: any) {
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.apiUrl + 'members/add-photo',
      authToken: `Bearer ${this.user?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (f) => {
      if (this.uploader) {
        if (this.uploader.queue.length > 1) {
          this.uploader.removeFromQueue(this.uploader.queue[0]);
        }
      }
      f.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        if (this.member && this.user) {
          this.member.photo = photo;
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }
}
