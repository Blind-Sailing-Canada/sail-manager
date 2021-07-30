import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { InstructionsState } from '../../models/instructions-state.interface';
import { copy } from '../../utils/copy';
import {
  putInstructions,
  resetInstructions,
} from '../actions/instructions.actions';

const initialState: InstructionsState = {};

const reducerHandler = createReducer(
  initialState,
  on(resetInstructions, () => initialState),
  on(putInstructions, (state, action) => {
    const updatedInstructions = Object.assign({}, copy(state));
    const instructionsArray = [].concat(action.instructions || []);

    instructionsArray
      .forEach((instructions) => {
        const boat_id = instructions.boat_id;

        if (!updatedInstructions[boat_id]) {
          updatedInstructions[boat_id] = {};
        }

        const instruction_type = instructions.instructionsType;

        updatedInstructions[boat_id][instruction_type] = instructions;
      });

    return updatedInstructions;
  }),
);

export function instructionsReducer(state: InstructionsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
