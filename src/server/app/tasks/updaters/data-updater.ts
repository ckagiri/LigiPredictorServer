let Moment = require('moment');

class DataUpdater {
  update(callback: Function) {
    callback(Moment().add(10, 'minutes')); 
  }
}

export const dataUpdater = new DataUpdater();