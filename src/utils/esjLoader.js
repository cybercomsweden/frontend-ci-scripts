const babel = require("babel-core");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

/**
 * Webpack loader for handling template loading.
 *
 * @param {String} source EJS source code.
 * @return {String} JS module code.
 */
module.exports = function(source) {
  this.cacheable();
  this.value = source;

  ejs.fileLoader = filePath => {
    this.addDependency(filePath);
    return fs.readFileSync(filePath);
  };

  const template = ejs.compile(source, {
    client: true,
    compileDebug: false,
    _with: false,
    filename: path.relative(process.cwd(), this.resourcePath),
  });

  return (
    "module.exports = " +
    babel
      .transform(template.toString(), {
        presets: [
          [
            require.resolve("babel-preset-env"),
            {
              useBuiltIns: true,
            },
          ],
        ],
        plugins: [require.resolve("babel-plugin-add-module-exports")],
        filename: path.basename(this.resourcePath),
        moduleRoot: path.dirname(this.resourcePath),
      })
      .code.replace(/'use strict';/gm, "")
      .replace(/"use strict";/gm, "")
  );
};

module.exports.seperable = true;
