// name of the library
var command = process.argv[2],
  eslint  = require('./tasks/eslint'),
  test    = require('./tasks/test'),
  serve   = require('./tasks/serve')

/**
 * Each task required (except watch) returns a promise so you will be able to chain them as you prefer
 */
switch (command) {
  case 'serve':
    serve();
    break;
  case 'eslint':
  case 'lint':
    eslint();
    break;
  case 'test':
    test();
    break;
}