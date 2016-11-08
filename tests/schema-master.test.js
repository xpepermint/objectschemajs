import test from 'ava';
import faker from 'faker';
import {
  Document,
  schemaMaster
} from '../dist';

function displayObj(label, obj) {
  console.log(label, '>>', JSON.stringify(obj, null, 2))
}

test('schema master', (t) => {
  const m = schemaMaster({
    name: 'master blaster',
    defaults: {
      age: 18
    },
    fakes: {
      country: 'UK'      
    }
  })  

  let personSchema = m.createSchema({
    name: 'Person',
    fields: () => ({
      name: {
        type: 'String'
      },
      age: {
        type: 'Integer'
        // defaultValue: 18
      }
    })
  });

  let userSchema = m.createSchema({
    name: 'User',
    mixins: [personSchema],
    fields: {
      enabled: {
        type: 'Boolean'
      },
      tags: {
        type: ['String']
      },
      keywords: {
        type: []
      }
    }
  });

  let overrideSchema = m.createSchema({
    name: 'Override',
    mixins: ['User'],
    fields: {
      enabled: {
        type: 'String'
      }
    }
  })

  // test registry
  let userFromReg = m.get('User')
  let schemaNames = m.names()

  t.true(schemaNames.includes('User'))

  t.is(userFromReg, userSchema, 'identical schema in registry')

  // test merging of schemas
  let fields = userSchema.fields
  t.is(fields.name.type, 'String')
  t.is(fields.age.type, 'Integer')

  // test mixin and override of schema found via registry lookup
  let ovrFields = overrideSchema.fields
  t.is(ovrFields.age.type, 'Integer')
  t.is(ovrFields.enabled.type, 'String')

  let user = new Document(userSchema);
  user.reset()

  t.is(user.age, 18);
});

