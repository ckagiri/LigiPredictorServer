namespace app.core {
  'use strict';

  factory.$inject = ['$window'];
  function factory($window: ng.IWindowService) {
    let _ = $window._;

    class EntitySet {
      constructor(Model: any) {
        this.Model = Model;
        let key = Model.key;
        let idKey = function (n: any) {
          return n == undefined ? null : n.id;
        }; // default
        if (typeof (key) === "string") {
          idKey = function (n) { return n[key]; };
        }
        if (typeof (key) === "function") {
          idKey = key;
        }
        this.idKey = idKey;
      }
      private Model: any;
      private idKey: Function;
      private items: any = {};

      mapDtoListToContext(dtoList: any[]) {
        if (!_.isArray(dtoList)) dtoList = [];
        this.items = dtoList.reduce((memo, dto) => {
          let id = this.idKey(dto);
          let item = this.items[id];
          if (item) {
            angular.extend(item, dto);
          } else {
            let Model = this.Model;
            item = new Model(dto);
          }
          memo[id] = item;
          return memo;
        }, {});
      }

      mapDtoToContext(dto: any) {
        let id = this.idKey(dto);
        if (!id) throw new Error('id not defined');
        let item = this.items[id];
        if (item) {
          angular.extend(item, dto);
        } else {
          let Model = this.Model;
          item = new Model(dto);
        }
        this.items[id] = item;
        return this.items[id];
      }

      add(newObj: any) {
        let id = this.idKey(newObj);
        this.items[id] = newObj;
        return this.items[id];
      }

      removeById(id: any) {
        delete this.items[id];
      }

      getById(id: any) {
        return !!id && !!this.items[id] ? this.items[id] : this.Model['nullo'];
      }

      getAll(options: any = {}) {
        let {filter, sortFn, page, size} = options;
        return this.itemsToArray(filter, sortFn, page, size);
      }

      clear() {
        for (let prop in this.items) {
          if (this.items.hasOwnProperty(prop)) {
            delete this.items[prop];
          }
        }
      }

      isEmpty = function () {
        for (let prop in this.items) {
          if (this.items.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      }

      getCount = function () {
        return Object.keys(this.items).length;
      }

      getFilteredCount = function (filter: any) {
        return this.itemsToArray(filter).length;
      }

      private itemsToArray(filter?: any, sortFn?: any, page?: number, size?: number) {
        let result = this.mapMemoToArray();
        if (filter) {
          result = result.filter(function (o: any) {
            let match = filter.predicate(o);
            return match;
          });
        }
        if (sortFn) {
          result.sort(sortFn);
        }
        if (page && size) {
          let start = (page - 1) * size;
          result = result.slice(start, start + size);
        }
        return result;
      }

      private mapMemoToArray() {
        let array = [];
        for (let prop in this.items) {
          if (this.items.hasOwnProperty(prop)) {
            array.push(this.items[prop]);
          }
        }
        return array;
      }
    }

    return EntitySet;
  }

  angular.module('app.core').factory('EntitySet', factory);
}