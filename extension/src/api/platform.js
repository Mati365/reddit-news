import _ from 'lodash';

/**
 * Interface between browser and shared code
 * todo: Inject shared code to background script
 */
let actions = {};
export function setBrowserAPI(callbacks) {
  _.assignIn(actions, callbacks);
}

export default actions;