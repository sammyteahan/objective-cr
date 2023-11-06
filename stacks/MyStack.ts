import { principalIsOwnedResource } from "aws-cdk-lib/aws-iam";
import { StackContext, Api, EventBus, Table, Auth } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk"
    },
    globalIndexes: {
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk"
      }
    },
  })

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, table],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /videos": "packages/functions/src/video.index",
      "GET /videos/{id}": "packages/functions/src/video.show",
      "POST /videos": "packages/functions/src/video.create",
    },
  });

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
      permissions: ['ses:SendEmail']
    }
  })

  auth.attach(stack, {
    api,
    prefix: "/auth",
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
