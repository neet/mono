import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import assert from "node:assert";

assert(process.env.OAUTH_CLIENT_ID);
assert(process.env.OAUTH_CLIENT_SECRET);

export const auth = betterAuth({
  account: {
    // https://github.com/better-auth/better-auth/issues/6252
    updateAccountOnSignIn: false,
  },
  plugins: [
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
