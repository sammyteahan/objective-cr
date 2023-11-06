import { ulid } from 'ulid'
import { Entity } from 'electrodb'

import * as Dynamo from '@objective-cr/core/src/dynamo'
export * as User from './user'

const User = new Entity({
  model: {
    entity: 'user',
    version: '1',
    service: 'objective-cr'
  },
  attributes: {
    userId: {
      type: 'string',
      required: true,
      readOnly: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    active: {
      type: 'boolean',
      required: false,
    },
    role: {
      type: 'string',
      required: false,
      default: () => 'contributor', // admin, contributor, reader
    },
  },
  indexes: {
    primary: {
      pk: {
        field: 'pk',
        composite: ['userId']
      },
      sk: {
        field: 'sk',
        composite: [],
      }
    },
    byEmail: {
      index: 'gsi1',
      pk: {
        field: 'gsi1pk',
        composite: ['email']
      },
      sk: {
        field: 'gsi1sk',
        composite: []
      }
    },
  },
}, Dynamo.Configuration)

export function create(email: string) {
  return User.create({
    userId: ulid(),
    email,
    active: true,
    role: 'contributor'
  }).go()
}

export function fromId(id: string) {
  return User.get({
    userId: id
  }).go()
}

export function fromEmail(email: string) {
  return User.query.byEmail({
    email
  }).go()
}
