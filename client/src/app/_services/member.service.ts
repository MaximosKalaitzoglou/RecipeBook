import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  apiUrl = environment.apiUrl;
  private members: Member[] = [];
  constructor(private http: HttpClient) {}

  getMemberId(): number {
    if (this.members.length < 1) return -1;
    var user = localStorage.getItem('user');

    if (user) {
      let userObj = JSON.parse(user);
      console.log(userObj);
      let member = this.members.find(
        (member) => member.userName == userObj.userName
      );
      console.log(member);
      if (member) {
        return member.id;
      } else {
        return -1;
      }
    }

    return 0;
  }

  getMembers() {
    if (this.members.length > 0) return of(this.members.slice());

    return this.http.get<Member[]>(this.apiUrl + 'members/list').pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMemberById(memberId: number) {
    if (this.members.length > 0)
      return of(this.members.find((member) => member.id === memberId));
    return this.http.get<Member>(this.apiUrl + 'members/' + memberId);
  }
}
