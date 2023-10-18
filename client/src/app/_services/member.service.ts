import { Injectable } from '@angular/core';
import { Member } from '../_models/member';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable, catchError, map, of } from 'rxjs';
import { Recipe } from '../_models/recipe';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  apiUrl = environment.apiUrl;
  private members: Member[] = [];
  constructor(private http: HttpClient) {}

  getMemberUsername(username: string): Observable<Member> {
    const member = this.members.find((m) => m.userName === username);

    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.apiUrl + 'members/' + username).pipe(
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

  getMembers(): Observable<Member[]> {
    if (this.members.length > 0) {
      return of(this.members);
    }

    return this.http.get<Member[]>(this.apiUrl + 'members/list').pipe(
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
      this.apiUrl + 'members/' + username + '/recipes'
    );
  }

}
