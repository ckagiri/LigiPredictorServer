let BASE_URL = "https://api.football-data.org/v1";

import * as request from 'request-promise';

function getOptions(apiKey: string, resource: string, queryParams: any) {

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

function mergeResponse(response: any) {

	return {
		data: JSON.parse(response.body),
		metadata: {
			requestCount: response.headers['x-requests-available'],
			requestCountReset: response.headers['x-requestcounter-reset']
		}
	};


}

export function makeRequest(apiKey: string, apiResource: string, options?: any) {

	return request(getOptions(apiKey, apiResource, options))
		.then(mergeResponse);
}