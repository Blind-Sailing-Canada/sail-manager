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
        const boatId = instructions.boatId;

        if (!updatedInstructions[boatId]) {
          updatedInstructions[boatId] = {};
        }

        const instructionType = instructions.instructionsType;

        updatedInstructions[boatId][instructionType] = instructions;
      });

    return updatedInstructions;
  }),
);

export function instructionsReducer(state: InstructionsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
