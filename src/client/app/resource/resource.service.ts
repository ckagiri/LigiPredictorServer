import {HttpService} from './http.service';

export class Resource {
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