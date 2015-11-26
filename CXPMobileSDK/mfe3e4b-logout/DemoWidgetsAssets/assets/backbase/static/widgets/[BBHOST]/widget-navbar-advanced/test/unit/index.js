/*----------------------------------------------------------------*/
/* Webpack main entry point
/*----------------------------------------------------------------*/

var mock = require('mock');
window = window || {};
window.b$ = { portal: mock.Portal({}) };
window.bd = mock.Bd({});

var testsContext = require.context('./', true, /^\.\/.*\.spec$/);
testsContext.keys().forEach(testsContext);

var testsContext = require.context('../../scripts/', true, /^\.\/.*\.spec$/);
testsContext.keys().forEach(testsContext);
