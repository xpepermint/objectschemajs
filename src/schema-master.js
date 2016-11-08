import { Schema } from './schemas'

// default schema registry
class Registry {
  constructor() {
    this.store = {}
  }

  names() {
    return Object.keys(this.store)
  }

  get(name) {
    return this.store[name]
  }

  set(name, schema) {
    this.store[name] = schema
  }
}

export class SchemaMaster {
  constructor(opts = {}) {
    this.name = opts.name 
    this.registry = {
      fakes: opts.fakes || {},
      defaults: opts.defaults || {},
      schemas: opts.schemas || new Registry()
    }
  }

  get schemas() {
    return this.registry.schemas
  }

  names() {
    return this.schemas.names()
  }

  get(name) {
    return this.schemas.get(name)
  }

  set(name, schema) {
    this.schemas.set(name, schema)
  }

  createSchema(obj) {
    let schema = new Schema(obj)    
    schema.registry = this.registry
    schema.master = this
    schema.init()
    this.set(schema.name, schema)
    return schema
  }
}

export const schemaMaster = (opts = {}) => {
  return new SchemaMaster(opts)
}