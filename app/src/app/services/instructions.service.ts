import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { BoatInstructions } from '../../../../api/src/types/boat-instructions/boat-instructions';
import { BoatInstructionType } from '../../../../api/src/types/boat-instructions/boat-instruction-type';
import { Boat } from '../../../../api/src/types/boat/boat';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  private readonly API_URL = '/api/boat-instructions';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public createInstructions(instructions: BoatInstructions): Observable<BoatInstructions> {
    return this.http.post<BoatInstructions>(`${this.API_URL}`, instructions);
  }

  public updateInstructions(id: string, instructions: BoatInstructions): Observable<BoatInstructions> {
    return this.http.patch<BoatInstructions>(`${this.API_URL}/${id}`, instructions);
  }

  public updateBoatInstructions(boat_id, instructions): Observable<Boat> {
    return this.http.patch<Boat>(`${this.API_URL}/update-boat-instructions/${boat_id}`, instructions);
  }

  public fetchInstructionsByBoat(boat_id: string): Observable<BoatInstructions[]> {
    return this.http.get<BoatInstructions[]>(`${this.API_URL}?boat_id=${boat_id}`);
  }

  public fetchInstructionsByType(boat_id: string, instructionsType: BoatInstructionType): Observable<BoatInstructions[]> {
    return this.http.get<BoatInstructions[]>(`${this.API_URL}?boat_id=${boat_id}&instruction_type=${instructionsType}`);
  }

}
