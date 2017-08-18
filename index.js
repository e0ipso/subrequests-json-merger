// @flow

import type { Response, ResponseMergerInterface } from 'subrequests/types/Responses';

const { ResponseMergerBase } = require('subrequests').lib;

/**
 * @classdesc
 *   Takes in a collection of sub-responses and returns a single JSON response.
 *
 * @class JsonResponses
 */
class JsonResponse extends ResponseMergerBase implements ResponseMergerInterface {

  /**
   * Merges many responses into a single one.
   *
   * @param {Response[]} responses
   *   An object containing information about the response body and headers.
   *
   * @return {Response}
   *   A single response containing all the responses.
   */
  static mergeResponses(responses: Array<Response>): Response {
    const subContentType = this._negotiateSubContentType(responses).replace(/"/g, '\\"');
    let index = 0;
    const parts: Object = responses
      .map(this._cleanResponse.bind(this))
      .map(this.serializeResponse.bind(this))
      // We will stringigy the whole body. We don't want double encoding on
      // each subresponse.
      .map(serializedResponse => JSON.parse(serializedResponse))
      .reduce((carry: Object, part: { headers: Object, body: string }) => {
        const content = part.headers['Content-ID'] || '';
        carry[content.slice(1, -1) || index++] = part; // eslint-disable-line no-plusplus
        return carry;
      }, {});

    const output: Response = {
      headers: new Map([
        // The status is always set to multi-status.
        ['Status', '207'],
        // Set the Content-Type and the sub-Content-Type.
        ['Content-Type', `application/json; type="${subContentType}"`],
      ]),
      body: JSON.stringify(parts),
    };
    return output;
  }

  /**
   * Builds a subresponse object based on the response to the subrequest.
   *
   * @param {Response} response
   *   The individual subresponse.
   *
   * @return {string}
   *   The serialized subresponse.
   *
   *  @private
   */
  static serializeResponse(response: Response): string {
    const { headers, body } = response;
    const headersObject: Object = [...headers].reduce((carry, tuple) => {
      carry[tuple[0]] = tuple[1];
      return carry;
    }, {});
    return JSON.stringify({ headers: headersObject, body });
  }

}

module.exports = JsonResponse;
