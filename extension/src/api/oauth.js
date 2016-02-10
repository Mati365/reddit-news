import qwest from 'qwest';
import _ from "lodash";

/**
 * Simple oauth client for reddit
 * @class
 */
class OAuth {
  /**
   * Authroize to server
   * @param params  OAuth parameters
   * @param page    Query params
   */
  static authorize(params, page) {
    let headers = OAuth.Headers[page]
      , queryParams = OAuth.serializeURL(_.assign(params, headers));
    qwest
      .get(`${headers.server}/api/v1/authorize?${queryParams}`)
      .then(data => {
        console.log(data);
      });
  }

  /**
   * Converts assoc array to URL
   * @param assoc   Assoc array
   * @param prefix  Name before array, only for arrays
   * @returns URL params
   */
  static serializeURL(assoc, prefix='') {
    return _.reduce(assoc, (sum, obj, index) => {
      index = encodeURIComponent(index);
      let key = prefix ? `${prefix}[${index}]` : index;

      return sum
        + (sum.length ? '&' : '')
        + (_.isArray(obj) ? OAuth.serializeURL(obj, index) : (key + '=' + encodeURIComponent(obj)));
    }, '');
  }
}
OAuth.Headers = {
  'reddit': {
    'server': 'https://www.reddit.com'
  , 'response_type': 'code'
  , 'duration': 'permanent'
  , 'state':  Math.random().toString(36).slice(2)
  , 'redirect_uri': 'http://localhost'
  }
};

export default OAuth;