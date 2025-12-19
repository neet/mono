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
          authorizationUrl: "http://localhost:3000/oauth/authorize",
          tokenUrl: "http://localhost:3000/oauth/token",
          userInfoUrl: "http://localhost:3000/api/v1/users/me",
          clientId: process.env.OAUTH_CLIENT_ID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          scopes: ["read", "write"],
          pkce: true,
        },
      ],
    }),
  ],
});
