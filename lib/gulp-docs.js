'use strict';

const Settings = require('./tasks/settings');

class GulpDocs {
  static defineTask (params){
    const settings = Settings(params);
    const tasks = [
      './tasks/indexing',
      './tasks/render',
      './tasks/build',
      './tasks/serve',
      './tasks/clean',
      './tasks/watch',
      './tasks/lint',
      './tasks/writing'
    ];
    tasks.forEach(task => require(task)(settings));
  }
}
module.exports = GulpDocs;
