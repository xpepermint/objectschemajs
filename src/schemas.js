/*
* A class for defining Document structure and properties.
*/
import merge from 'lodash.merge'

function displayObj(label, obj) {
  console.log(label, '>>', JSON.stringify(obj, null, 2))
}

export class Schema {

  lookupSchema(name) {
    try {
      let schemas = this.master && this.master.schemas
      if (!schemas) return {}
      return schemas.get(name) || {}
    } catch (err) {
      return {}
    }    
  }

  resolveMixins() {
    if (!this.mixins || !Array.isArray(this.mixins)) return

    let resultFields = {}
    for (let mixin of this.mixins) {
      if (!mixin) continue

      let mixinSchema = (typeof mixin === 'object') ? mixin : this.lookupSchema(mixin)

      let mFields = mixinSchema.fields
      if (!mFields) continue            
      let myFields = this.fields || this._fields

      merge(resultFields, mFields, myFields)
    } 
    this.configureFields(resultFields, 'abc123')    
    return this
  }

  /*
  * Class constructor.
  */
  constructor ({name, mixins, fakes={}, fields={}, strict=true, validatorOptions={}, typeOptions={}}={}) {
    Object.defineProperty(this, 'name', { // document name
      value: name
    });

    Object.defineProperty(this, 'mixins', { // schema mixins
      value: mixins
    });

    Object.defineProperty(this, 'fakes', { // document fakes registry
      get: () => typeof fakes === 'function' ? fakes() : fakes,
    });

    if (!mixins) {
      this.configureFields(fields, 'abc123')
    } else {
      this._fields = fields // to be used for dynamic mixin resolution 
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
    return this.resolveMixins()
  }

  configureFields(fields, secret) {
    if (secret !== 'abc123') return
    Object.defineProperty(this, 'fields', { // document fields
      get: () => typeof fields === 'function' ? fields() : fields,
    });    
    delete this['_fields']
    return this
  }
}
