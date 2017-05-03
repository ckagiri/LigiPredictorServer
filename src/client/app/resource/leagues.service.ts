import {Resource} from './resource.service';

export class HeroResource extends Resource {
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
        };

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