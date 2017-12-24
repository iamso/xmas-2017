const OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
  "env": {
    "browser" : true,
    "node" : true,
    "es6": true,
    "jquery": true
  },
  "ecmaFeatures": {
    "modules": true
  },
  "extends": ["eslint:recommended", "google"],
  "rules": {
    "no-console": WARN,
    "no-undef": WARN,
    "no-unused-vars": WARN,
    "object-curly-spacing": OFF,
    "no-multiple-empty-lines": OFF,
    "arrow-parens": OFF,
    "require-jsdoc": OFF,
    "brace-style": OFF,
    "padded-blocks": OFF,
    "max-len": WARN,
  },
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module"
  }
};
