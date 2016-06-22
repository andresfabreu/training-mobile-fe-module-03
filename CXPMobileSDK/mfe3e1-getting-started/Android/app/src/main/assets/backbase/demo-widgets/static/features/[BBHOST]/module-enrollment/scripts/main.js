define(function(require, exports, module) {
  'use strict';

  module.name = 'module-enrollment';

  var base = require('base');
  var core = require('core');

  var deps = [
    core.name,
      require('./components/steps-indicator/scripts/main').name,
      require('./components/idle/scripts/main').name,
      require('./components/labeled-input/scripts/main').name
  ];

  module.exports = base.createModule(module.name, deps)
      .factory( require('./util') )
      .provider( require('./api') );
});
