import { ulid } from "ulid";
import { Entity } from "electrodb";

import * as Dynamo from './dynamo'
export * as Video from './video'

const Video = new Entity({
  model: {
    entity: "video",
    version: "1",
    service: "objective-cr",
  },
  attributes: {
    videoId: {
      type: "string",
    },
    videoType: {
      type: "string",
    },
    description: {
      type: "string",
    },
    transcript: {
      type: "string",
    },
    path: {
      type: "string",
    },
    title: {
      type: "string",
    },
  },
  indexes: {
    primary: {
      pk: {
        field: "pk",
        composite: ["videoId"],
      },
      sk: {
        field: 'sk',
        composite: []
      }
    },
    list: {
      index: "gsi1",
      pk: {
        field: "gsi1pk",
        composite: ["videoType"]
      },
      sk: {
        field: "gsi1sk",
        composite: []
      }
    }
  }
}, Dynamo.Configuration)

export function fromId(id: string) {
  return Video.get({
    videoId: id,
  }).go()
}

export function create(title: string, description: string) {
  return Video.create({
    videoId: ulid(),
    videoType: "video#marketing",
    title,
    description,
    transcript: "",
    path: "",
  }).go()
}

export function list() {
  return Video.query.list({
    videoType: "video#marketing"
  }).go()
}
