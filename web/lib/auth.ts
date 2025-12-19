import assert from "node:assert";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { Pool } from "pg";

assert(process.env.OAUTH_CLIENT_ID);
assert(process.env.OAUTH_CLIENT_SECRET);

export const auth = betterAuth({
  basePath: "/internal/auth",
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          providerId: "mono",
          authorizationUrl: `${process.env.API_URL}/oauth/authorize`,
          tokenUrl: `${process.env.API_URL}/oauth/token`,
          userInfoUrl: `${process.env.API_URL}/api/v1/users/me`,
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          scopes: ["read", "write"],
          pkce: true,
        },
      ],
    }),
  ],
});
