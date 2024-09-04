import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Boat } from '../../../../api/src/types/boat/boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  private readonly API_URL = '/api/boat';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchOne(id: string): Observable<Boat> {
    return this.http.get<Boat>(`${this.API_URL}/${id}`);
  }

  deleteOne(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  fetchAll(): Observable<Boat[]> {
    return this.http.get<Boat[]>(this.API_URL);
  }

  findByName(name: string): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.API_URL}?filter=name||$contL||${name}`);
  }

  update(id: string, boat: Partial<Boat>): Observable<Boat> {
    return this.http.patch<Boat>(`${this.API_URL}/${id}`, boat);
  }

  create(boat: Partial<Boat>): Observable<Boat> {
    return this.http.post<Boat>(`${this.API_URL}`, boat);
  }
}
