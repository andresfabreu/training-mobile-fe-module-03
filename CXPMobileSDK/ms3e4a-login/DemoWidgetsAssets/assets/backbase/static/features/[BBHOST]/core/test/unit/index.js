/*----------------------------------------------------------------*/
/* Webpack main entry point
/*----------------------------------------------------------------*/

var testsContext = require.context('./', true, /.spec$/);
testsContext.keys().forEach(testsContext);
