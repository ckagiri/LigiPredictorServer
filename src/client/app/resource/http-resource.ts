class Resource {
	public url: string;

	constructor(protected httpService: HttpService) { }

	create(data: any): ng.IPromise<any> {
			return this.request('POST', `${this.addSlash(this.url)}new`, null, data);
	}

	get(id: string): ng.IPromise<any> {
			return this.request('GET', `${this.addSlash(this.url)}:id`, {id});
	}

	update(id: string, data: any): ng.IPromise<any> {
			return this.request('PUT', `${this.addSlash(this.url)}:id`, {id}, data);
	}

	delete(id: string): ng.IPromise<any> {
			return this.request('DELETE', `${this.addSlash(this.url)}:id`, {id});
	}

	protected addSlash(url: string): string {
		return url && url.indexOf('/', url.length - 1) === -1 ? `${url}/` : url;
	}

	protected request(method: string,
										url: string,
										parameters?: any,
										data?: any,
										headers?: any,
										responseHandler?: (response: any) => void,
										errorHandler?: (error: any, response?: any, request?: any) => void): ng.IPromise<any> {
			let body = JSON.stringify(data);
			let headers_ = headers;
			let options = { headers: headers_ };

			let request_ = { method, url, parameters, data, headers };
			if(method === 'POST') {
					return this.addHandlers(
						this.httpService.post(url, parameters, body, options), responseHandler, errorHandler, request_);
			} if(method === 'PUT') {
					return this.addHandlers(
						this.httpService.put(url, parameters, body, options), responseHandler, errorHandler, request_);
			} if(method === 'DELETE') {
					return this.addHandlers(
						this.httpService.delete(url, parameters, options), responseHandler, errorHandler, request_);
			} else { // method === 'GET'
					return this.addHandlers(
						this.httpService.get(url, parameters, options), responseHandler, errorHandler, request_);
			}
	}

	protected addHandlers(promise: ng.IPromise<any>,
										responseHandler?: (response: any) => void,
										errorHandler?: (error: any, response?: any, request?: any) => void,
										request?: any): ng.IPromise<any> {
			return promise.catch((error:any) => {
					let error_ = error.text() ? error.json() : error.text();
					if(errorHandler) {
							errorHandler(error_, error, request);
					}
					return null;//promise.(error_);
			}).then((response: any) => {
					if(responseHandler) {
							responseHandler(response);
					}
					return response;
			});
	}  
}

class HttpService {
	constructor(private http: ng.IHttpService) { }

	get(endpoint: string, parameters?: any, options?: any): ng.IPromise<any> {
			let url = this.constructUrl(endpoint, parameters);
			return this.http.get(url, options);
	}

	delete(endpoint: string, parameters?: any, options?: any): ng.IPromise<any> {
			let url = this.constructUrl(endpoint, parameters);
			return this.http.delete(url, options);
	}

	post(endpoint: string, parameters: any, body: any, options?: any): ng.IPromise<any> {
			let url = this.constructUrl(endpoint, parameters);
			return this.http.post(url, body, options);
	}

	put(endpoint: string, parameters: any, body: any, options?: any): ng.IPromise<any> {
			let url = this.constructUrl(endpoint, parameters);
			return this.http.put(url, body, options);
	}

	private constructUrl(endpoint: string, parameters?: any): string {
			let formatted = endpoint;
			let tokens = parameters;
			let query:any = {};
			for (let propName in tokens) {
					let propValue = tokens[propName];
					let temp = formatted.replace(':'+propName, propValue);
					if(temp === formatted) {
							query[propName] = propValue;
					}
					formatted = temp;
			}

			let querystring = this.toQueryString(query);
			if(formatted && querystring) {
					if(formatted.indexOf('?') !== -1) {
							formatted = formatted + querystring;
					} else {
							formatted = `${formatted}?${querystring}`;
					}
			}

			return formatted;
	}

	private toQueryString(keyValuePair: any): string {
			let queryString = '';
			for (let key in keyValuePair) {
					if (keyValuePair.hasOwnProperty(key)) {
							let value = keyValuePair[key];
							if(queryString) {
									queryString += '&';
							}
							queryString += `${key}=${value}`;
					}
			}
			return queryString;
	}
}

class HeroResource extends Resource {
	//  create, get, update, and delete functions are automatically available after setting url
	url = 'https://your.domain.here/hero';

	// (optional) defining a custom endpoint function
	getByName(name: string): ng.IPromise<any> {
			return this.request('GET', 'https://your.domain.here/hero?name=:name', { name: name });
			//  alternative syntax:  return this.request('GET', 'https://your.domain.here/hero', { name: name });
			//  unreferenced parameters are appended as a query string
	}

	//  (optional) defining a custom endpoint function to override the default create, get, update, or delete function
	update(id: string, data: any): ng.IPromise<any> {
			return this.request('PATCH', 'https://your.domain.here/hero/:id', {id: id}, data);
	}
}

function xy() {
	let hero: any = { 
		id: null,
		name: 'Super Guy',
		powers: 'Extreme Speed'
	}

	//  create, get, update, and delete functions are automatically available
	this.heroResource.create(hero);

	this.heroResource.get(hero.id);

	//  example using the custom endpoint function we defined earlier
	this.heroResource.getByName('Super Guy');

	//  default update function uses the PUT operation.
	//  you may change it's behavior through a custom endpoint function (see above hero-resource.service.ts)
	hero.name = 'Wonder Guy';
	this.heroResource.update(hero.id, hero);

	this.heroResource.delete(hero.id);
}