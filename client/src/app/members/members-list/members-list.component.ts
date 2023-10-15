import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  members: Member[] = [];

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (response) => {
        this.members = response;
      },
    });
  }
}
