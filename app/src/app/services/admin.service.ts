import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { GroupMember } from '../../../../api/src/types/group/group-member';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_URL = '/api/admin';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  listCrewGroupMembers() {
    return this.http.get<GroupMember[]>(`${this.API_URL}/crew-group-members`);
  }

  listSkipperGroupMembers() {
    return this.http.get<GroupMember[]>(`${this.API_URL}/skipper-group-members`);
  }

  listMemberGroupMembers() {
    return this.http.get<GroupMember[]>(`${this.API_URL}/member-group-members`);
  }

  deleteCrewGroupMember(email: string) {
    return this.http.patch(`${this.API_URL}/crew-group-members`, { email });
  }

  deleteSkipperGroupMember(email: string) {
    return this.http.patch(`${this.API_URL}/skipper-group-members`, { email });
  }

  deleteMemberGroupMember(email: string) {
    return this.http.patch(`${this.API_URL}/member-group-members`, { email });
  }

  addCrewGroupMember(email: string) {
    return this.http.put(`${this.API_URL}/crew-group-members`, { email });
  }

  addSkipperGroupMember(email: string) {
    return this.http.put(`${this.API_URL}/skipper-group-members`, { email });
  }

  addMemberGroupMember(email: string) {
    return this.http.put(`${this.API_URL}/member-group-members`, { email });
  }
}
