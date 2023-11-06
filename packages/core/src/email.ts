export * as Email from './email'

import { z } from 'zod'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

import { validate } from './zod'

const ses = new SESv2Client({})

/**
 * This email 'domain' is going to depend on SES.
 * Optimally this domain would include an adapter layer
 * in case we wanted to swap it out for another provider
 */
export const send = validate(z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
}), async input => {
  await ses.send(new SendEmailCommand({
    Destination: {
      ToAddresses: [input.to],
    },
    FromEmailAddress: "Example <sammyteahan@gmail.com>",
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: input.html,
          }
        },
        Subject: {
          Data: input.subject
        }
      }
    },
  }))
})

