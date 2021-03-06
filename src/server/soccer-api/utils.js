"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BASE_URL = "http://api.football-data.org/v1";
var request = require("request-promise");
function getOptions(apiKey, resource, queryParams) {
    queryParams = queryParams || {};
    return {
        method: 'GET',
        url: BASE_URL + resource,
        headers: {
            'X-Auth-Token': apiKey,
            'X-Response-Control': "minified"
        },
        resolveWithFullResponse: true,
        qs: queryParams
    };
}
function mergeResponse(response) {
    return {
        data: JSON.parse(response.body),
        metadata: {
            requestCount: response.headers['x-requests-available'],
            requestCountReset: response.headers['x-requestcounter-reset']
        }
    };
}
function makeRequest(apiKey, apiResource, options) {
    return request(getOptions(apiKey, apiResource, options))
        .then(mergeResponse);
}
exports.makeRequest = makeRequest;
//# sourceMappingURL=utils.js.map