# Build a Supabase Integration

## Overview

This guide provides a step-by-step process for building a Supabase Integration using OAuth2 and the Management API. It enables you to manage users' organizations and projects on their behalf by retrieving access and refresh tokens that grant your application full access to the Management API.

## Create an OAuth App

1. Navigate to the OAuth Apps tab in your organization's settings.
2. Click **Add application** in the upper-right section of the page.
3. Fill in the required details and click **Confirm**.

## Show a "Connect Supabase" Button

Add a "Connect Supabase" button in your user interface to initiate the OAuth flow, following the design guidelines in the brand assets.

## Implementing the OAuth 2.0 Flow

After publishing your OAuth App on Supabase, use the OAuth 2.0 protocol to obtain authorization from users to manage their organizations and projects.

### Redirecting to the Authorize URL

Redirect the user to `https://api.supabase.com/v1/oauth/authorize` with the following required query parameters:

- **client_id**: Your client ID from the app creation.
- **redirect_uri**: The URL where Supabase will redirect the user after consent.
- **response_type**: Set to `code`.
- **state**: Information about the state of your app (combined with `redirect_uri`, cannot exceed 4kB).
- **organization_slug**: (Optional) The slug of the organization to connect to.
- **PKCE**: Recommended for increased security. Generate a random value (code verifier), hash it with SHA256, and include it as `code_challenge` with `code_challenge_method` set to `S256`.

```typescript
router.get('/connect-supabase/login', async (ctx) => {
  const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri();
  console.log(uri.toString());
  ctx.state.session.flash('codeVerifier', codeVerifier);
  ctx.response.redirect(uri);
});
```

Find the full example on GitHub.

### Handling the Callback

After user consent, Supabase redirects to the `redirect_uri` with the following query parameters:

- **code**: An authorization code to exchange for access and refresh tokens.
- **state**: The value provided earlier to associate the request with the user.

Exchange the authorization code for tokens by calling `POST https://api.supabase.com/v1/oauth/token` with the following parameters:

- **grant_type**: `authorization_code`.
- **code**: The authorization code received.
- **redirect_uri**: Must match the initial URL.
- **code_verifier**: (Recommended) Include if using PKCE.

Provide the client ID and secret as a basic auth header:

```typescript
router.get('/connect-supabase/oauth2/callback', async (ctx) => {
  const codeVerifier = ctx.state.session.get('codeVerifier') as string;
  if (!codeVerifier) throw new Error('No codeVerifier!');

  const tokens = await fetch(config.tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: ctx.request.url.searchParams.get('code') || '',
      redirect_uri: config.redirectUri,
      code_verifier: codeVerifier,
    }),
  }).then((res) => res.json());
  console.log('tokens', tokens);
  ctx.response.body = 'Success';
});
```

Find the full example on GitHub.

## Refreshing an Access Token

Use the `POST /v1/oauth/token` endpoint to refresh an access token using the refresh token obtained earlier. Handle HTTP Unauthorized errors if the user revokes access.

## Calling the Management API

Refer to the Management API reference for authentication details.

### Use the JavaScript (TypeScript) SDK

For JavaScript/TypeScript, use the `supabase-management-js` library:

```typescript
import { SupabaseManagementAPI } from 'supabase-management-js';

const client = new SupabaseManagementAPI({ accessToken: '<access token>' });
```

## Integration Recommendations

Consider the following patterns to enhance user experience:

### Store API Keys in Environment Variables

Retrieve a project's API credentials using the `/projects/{ref}/api-keys` endpoint.

### Pre-fill Database Connection Details

Prefill the Postgres connection details for users:

```
postgresql://postgres:[DB-PASSWORD]@db.[REF].supabase.co:5432/postgres
```

### Create New Projects

Use the `/v1/projects` endpoint to create a new project, asking users for a database password or generating one.

### Configure Custom Auth SMTP

Configure custom SMTP settings using the `/config/auth` endpoint.

### Handling Dynamic Redirect URLs

Include the desired redirect URL in the `state` parameter during the OAuth process. After authorization, verify and extract the redirect URL from the state value.

## Current Limitations

Some features are limited until fine-grained access control is implemented. Users must provide their database password for full database access.