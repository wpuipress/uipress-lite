```yaml
name: supabase-management
description: This skill facilitates the integration and management of Supabase projects using OAuth2 and the Management API. It is ideal for developers looking to manage users' organizations and projects on their behalf through Supabase's integration capabilities.
```

## Overview
The Supabase Management skill allows developers to integrate their applications with Supabase using OAuth2. This enables full access to the Supabase Management API, allowing for seamless management of users' organizations and projects. This skill is particularly useful for building integrations that require user authentication and project management capabilities.

## Quick Start
To quickly integrate Supabase into your application, follow these steps:

1. **Create an OAuth App**:
   - Navigate to your organization's settings and select the OAuth Apps tab.
   - Click "Add application" and fill in the necessary details.
   - Confirm to create the app.

2. **Implement OAuth 2.0 Flow**:
   - Add a "Connect Supabase" button in your UI to initiate the OAuth flow.
   - Redirect users to `https://api.supabase.com/v1/oauth/authorize` with required query parameters:
     - `client_id`: Your app's client ID.
     - `redirect_uri`: URL for redirection post-consent.
     - `response_type`: Set to `code`.
     - `state`: App state information (ensure `redirect_uri` and `state` do not exceed 4kB).
     - `organization_slug`: Optional, pre-selects an organization.
     - Use PKCE for enhanced security.

3. **Scopes for OAuth App**:
   - Define scopes to specify access levels for your integration.
   - Scopes can be read or write and are set in the Supabase Dashboard.

For detailed API reference, see [build-a-supabase-oauth-integration](sections/build-a-supabase-oauth-integration.md).

## Section Index
- **[overview](sections/overview.md)**: Comprehensive guide on building a Supabase integration, including Vercel and Supabase Marketplace details.
- **[build-a-supabase-oauth-integration](sections/build-a-supabase-oauth-integration.md)**: Detailed information on OAuth scopes and implementation.

## Key Concepts
- **OAuth2 Integration**: Use OAuth2 to authenticate and authorize users, granting your app access to manage Supabase projects.
- **Scopes**: Define specific access levels for your app, ensuring security and appropriate permissions.
- **Vercel Marketplace**: Manage Supabase resources directly from Vercel, with unified billing and authentication.

## Common Examples
- **Connecting a Supabase Project**: Automatically synchronize projects created via Vercel Marketplace with Vercel projects, setting essential environment variables.
- **Managing OAuth Scopes**: Update scopes as needed, prompting users to re-authorize for changes to take effect.

## Important Notes
- **PKCE Flow**: Strongly recommended for security when implementing OAuth2.
- **Marketplace Listings**: Integrations must meet specific criteria for listing in the Supabase Marketplace, including business viability and compliance.

For more information on building a Supabase integration, see [overview](sections/overview.md).
```