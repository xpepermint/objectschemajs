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
    this.registry = opts.registry || new Registry()
  }

  names() {
    return this.registry.names()
  }

  get(name) {
    return this.registry.get(name)
  }

  set(name, schema) {
    this.registry.set(name, schema)
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