import test from 'ava';
import faker from 'faker';
import {
  Document,
  Schema,
  ValidationError,
  ValidatorError
} from '../dist';

function displayObj(label, obj) {
  console.log(label, '>>', JSON.stringify(obj, null, 2))
}

test('schema mixins', (t) => {
  let personSchema = new Schema({
    fields: () => ({
      name: {
        type: 'String'
      },
      age: {
        type: 'Integer',
        defaultValue: 18
      }
    })
  });

  let userSchema = new Schema({
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
  }).init();

  // displayObj('userSchema', userSchema)

  // test merging of schemas
  let fields = userSchema.fields
  t.is(fields.name.type, 'String')
  t.is(fields.age.type, 'Integer')

  let user = new Document(userSchema);
  user.reset()

  t.is(user.age, 18);
});