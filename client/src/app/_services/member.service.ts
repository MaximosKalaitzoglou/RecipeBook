import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Recipe } from '../_models/recipe';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  apiUrl = environment.apiUrl;
  private members: Member[] = [];
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  getMemberUsername(username: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === username);
    if (member) {
      return of(member);
    }

    return this.http
      .get<Member>(this.apiUrl + 'members/' + username, this.getHttpOptions())
      .pipe(
        map((fetchedMember) => {
          this.members.push(fetchedMember); // Cache the member data
          return fetchedMember;
        }),
        catchError((error) => {
          // Handle the error appropriately
          console.error('Error fetching member data:', error);
          throw error;
        })
      );
  }

  getMemberUsernameToEdit(username: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === username);
    if (member) {
      return of(member);
    }

    return this.http
      .get<Member>(
        this.apiUrl + 'members/' + username + '/edit',
        this.getHttpOptions()
      )
      .pipe(
        map((fetchedMember) => {
          this.members.push(fetchedMember); // Cache the member data
          return fetchedMember;
        })
      );
  }

  getMembers(): Observable<Member[]> {
    if (this.members.length > 0) {
      return of(this.members);
    }

    return this.http
      .get<Member[]>(this.apiUrl + 'members/list', this.getHttpOptions())
      .pipe(
        map((members) => {
          this.members = members;
          return members;
        }),
        catchError((error) => {
          // Handle the error appropriately
          console.error('Error fetching members data:', error);
          return of([]); // You can return a default value or an error indicator here
        })
      );
  }

  getMemberRecipes(username: string) {
    return this.http.get<Recipe[]>(
      this.apiUrl + 'members/' + username + '/recipes',
      this.getHttpOptions()
    );
  }

  updateMember(
    member: { alias: string; description: string; gender: string },
    username: string
  ) {
    return this.http
      .put(this.apiUrl + 'members/' + username, member, this.getHttpOptions())
      .pipe(
        tap((res) => {
          const index = this.members.findIndex(
            (mem) => mem.userName === username
          );

          if (index !== -1) {
            this.members[index] = { ...this.members[index], ...member };
          }
        })
      );
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token,
      }),
    };
  }

  clearCachedMembers() {
    this.members = [];
  }
}
