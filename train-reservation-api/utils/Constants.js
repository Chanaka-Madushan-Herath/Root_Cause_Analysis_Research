const define = (name, value) => {
  Object.defineProperty(exports, name, {
    value,
    enumerable: true
  });
};

define('ERROR_400', 400);
define('ERROR_401', 401);
define('ERROR_500', 500);
define('ERROR_403', 403);
