import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';

import { db } from '#lib/server/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8
  },

  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 24
    })
  ]
});