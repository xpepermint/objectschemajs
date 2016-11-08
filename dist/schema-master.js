'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaMaster = exports.SchemaMaster = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _schemas = require('./schemas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default schema registry
class Registry {
  constructor() {
    this.store = {};
  }

  names() {
    return (0, _keys2.default)(this.store);
  }

  get(name) {
    return this.store[name];
  }

  set(name, schema) {
    this.store[name] = schema;
  }
}

class SchemaMaster {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.registry = {
      fakes: opts.fakes || {},
      defaults: opts.defaults || {},
      schemas: opts.registry || new Registry()
    };
  }

  get schemas() {
    return this.registry.schemas;
  }

  names() {
    return this.schemas.names();
  }

  get(name) {
    return this.schemas.get(name);
  }

  set(name, schema) {
    this.schemas.set(name, schema);
  }

  createSchema(obj) {
    let schema = new _schemas.Schema(obj);
    schema.registry = this.registry;
    schema.master = this;
    schema.init();
    this.set(schema.name, schema);
    return schema;
  }
}

exports.SchemaMaster = SchemaMaster;
const schemaMaster = exports.schemaMaster = function () {
  let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return new SchemaMaster(opts);
};