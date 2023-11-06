import { AuthHandler, LinkAdapter } from "sst/node/auth";

import { User } from '@objective-cr/core/user'
import { Email } from '@objective-cr/core/email'

/**
 * Define session types
 */
declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userId: string;
    }
  }
}

export const handler = AuthHandler({
  providers: {
    link: LinkAdapter({
      /**
       * provides: auth/authorize?email=user@example.com
       */
      onLink: async (link, claims) => {
        await Email.send({
          to: claims.email,
          subject: 'Sign in to Objective CR',
          html: `Here is your sign in <a href="${link}">link</a>`
        })

        return {
          statusCode: 200,
        }
      },

      /**
       * provides success callback
       */
      onSuccess: async (claims) => {
        const user = await User.fromEmail(claims.email)

        if (!user.data[0]) {
          await User.create(claims.email)
        }

        /**
         * TODO: issue session 
         * TODO: redirect to correct frontend location
         */
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(claims)
        }
      },

      onError: async () => {
        return {
          statusCode: 401
        }
      },
    })
  }
})
