import { Record } from 'immutable';
import constants from 'src/constants';

export const Error = new Record({
  type: constants.errorTypes.error,
  message: undefined,
});
