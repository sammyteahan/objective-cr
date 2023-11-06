import { ApiHandler } from "sst/node/api";

import { Video } from "@objective-cr/core/video"

export const create = ApiHandler(async (_evt) => {
  const video = await Video.create("body.title", "test-description")

  return {
    statusCode: 200,
    body: video.data,
  };
});

export const index = ApiHandler(async (_evt) => {
  const result = await Video.list()

  return {
    statusCode: 200,
    body: JSON.stringify(result.data),
  };
});

export const show = ApiHandler(async (evt) => {
  const id = evt?.pathParameters?.id;

  const result = await Video.fromId(id)

  return {
    statusCode: 200,
    body: JSON.stringify(result.data)
  };
})
