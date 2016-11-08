'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function displayObj(label, obj) {
  console.log(label, '>>', (0, _stringify2.default)(obj, null, 2));
} /*
  * A class for defining Document structure and properties.
  */
class Schema {

  lookupSchema(name) {
    try {
      let registry = this.registry || (this.master || {}).registry;
      let found = registry.get(name) || {};
      return found;
    } catch (err) {
      return {};
    }
  }

  resolveMixins() {
    if (!this.mixins || !Array.isArray(this.mixins)) return;

    let resultFields = {};
    for (let mixin of this.mixins) {
      if (!mixin) continue;

      let mixinSchema = typeof mixin === 'object' ? mixin : this.lookupSchema(mixin);

      let mFields = mixinSchema.fields;
      if (!mFields) continue;
      let myFields = this.fields || this._fields;

      (0, _lodash2.default)(resultFields, mFields, myFields);
    }
    this.configureFields(resultFields, 'abc123');
    return this;
  }

  /*
  * Class constructor.
  */
  constructor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    let name = _ref.name,
        mixins = _ref.mixins;
    var _ref$fakes = _ref.fakes;
    let fakes = _ref$fakes === undefined ? {} : _ref$fakes;
    var _ref$fields = _ref.fields;
    let fields = _ref$fields === undefined ? {} : _ref$fields;
    var _ref$strict = _ref.strict;
    let strict = _ref$strict === undefined ? true : _ref$strict;
    var _ref$validatorOptions = _ref.validatorOptions;
    let validatorOptions = _ref$validatorOptions === undefined ? {} : _ref$validatorOptions;
    var _ref$typeOptions = _ref.typeOptions;
    let typeOptions = _ref$typeOptions === undefined ? {} : _ref$typeOptions;

    Object.defineProperty(this, 'name', { // document name
      value: name
    });

    Object.defineProperty(this, 'mixins', { // schema mixins
      value: mixins
    });

    Object.defineProperty(this, 'fakes', { // document fakes registry
      get: () => typeof fakes === 'function' ? fakes() : fakes
    });

    if (!mixins) {
      this.configureFields(fields, 'abc123');
    } else {
      this._fields = fields; // to be used for dynamic mixin resolution 
    }

    Object.defineProperty(this, 'strict', { // document schema mode
      value: strict
    });
    Object.defineProperty(this, 'validatorOptions', { // options for validatable.js
      value: validatorOptions
    });
    Object.defineProperty(this, 'typeOptions', { // options for typeable.js
      value: typeOptions
    });
  }

  init() {
    return this.resolveMixins();
  }

  configureFields(fields, secret) {
    if (secret !== 'abc123') return;
    Object.defineProperty(this, 'fields', { // document fields
      get: () => typeof fields === 'function' ? fields() : fields
    });
    delete this['_fields'];
    return this;
  }
}
exports.Schema = Schema;