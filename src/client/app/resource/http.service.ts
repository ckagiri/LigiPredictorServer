export class HttpService {
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
