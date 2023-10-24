import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from 'src/app/_models/member';
@Component({
  selector: 'app-add-chat',
  templateUrl: './add-chat.component.html',
  styleUrls: ['./add-chat.component.css'],
})
export class AddChatComponent {
  faEnvelope = faEnvelope;
  modalRef?: BsModalRef;
  searchQuery: string = '';
  members: Member[] | null = null;

  constructor(
    private modalService: BsModalService,
    private memberService: MemberService
  ) {}

  onShowModal(templateRef: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templateRef);
  }

  //TODO: Add paginationFilter on search users 
  searchUsers() {
    // Some load balancing with setTimeout    
    setTimeout(() => {
      this.memberService.searchMembers(this.searchQuery).subscribe({
        next: (response) => {
          this.members = response;
          console.log('Got response');
        },
      });
    }, 300);
  }
}
