import _ from 'lodash';

/**
 * Interface between browser and shared code
 */
let actions = {};
export function setBrowserAPI(callbacks) {
  _.assignIn(actions, callbacks);
}

export default actions;