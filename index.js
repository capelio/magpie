require = require("esm")(module);
require("app-module-path/register");
module.exports = require("src/main");
