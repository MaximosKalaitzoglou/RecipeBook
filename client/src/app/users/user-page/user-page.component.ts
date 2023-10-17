import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  member: Member | undefined;
  username = '';
  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.username = params['username'];
        this.memberService.getMemberUsername(this.username).subscribe({
          next: (member) => {
            this.member = member;
          },
        });
      },
    });
  }
}
