# Management API Overview

The Management API allows you to manage your Supabase organizations and projects programmatically. This section provides details on authentication, rate limits, and various endpoints available for interacting with the Management API.

## Authentication

All API requests require an access token included in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Generating Access Tokens

There are two methods to generate an access token:

1. **Personal Access Token (PAT)**: 
   - Long-lived tokens generated manually for accessing the Management API.
   - Useful for automating workflows or development.
   - Manage PATs via your account page.

2. **OAuth2**: 
   - Allows applications to generate tokens on behalf of a Supabase user.
   - Provides secure and limited access without requiring user credentials.
   - Tokens are short-lived and tied to specific scopes.

### Example Request

```bash
curl https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer sbp_bdd0••••••••••••••••••••••••••••••••4f23"
```

All API requests must be authenticated and made over HTTPS.

## Rate Limits

Rate limits are enforced to prevent abuse and ensure fair usage. They are based on a per-user, per-scope model.

### Standard Rate Limit

| Limit               | Duration | Scope                              |
|---------------------|----------|------------------------------------|
| 120 requests         | 1 minute | Per user, per project/organization |

Exceeding the rate limit results in a `429 Too Many Requests` response. Once the time window expires, the request quota resets.

### Rate Limit Scope

- **Project Scope**: Rate limits apply independently to each project.
- **Organization Scope**: Rate limits apply independently to each organization.

### Rate Limit Response Headers

Every API response includes rate limit information in the following headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the current time window.
- `X-RateLimit-Remaining`: Number of requests remaining before hitting the rate limit.
- `X-RateLimit-Reset`: Milliseconds remaining until the rate limit resets.

### How Rate Limits Are Tracked

Requests are identified using:

1. OAuth App ID (if authenticated via OAuth)
2. User ID (if authenticated with a PAT)
3. IP Address (if unauthenticated)

### Endpoint Exceptions

Some endpoints have stricter rate limits:

| Endpoint                                                    | Limit          | Duration | Reason                                           |
|------------------------------------------------------------|----------------|----------|--------------------------------------------------|
| GET /v1/projects/:ref/endpoints/logs.all                  | 30 requests     | 1 minute | Analytics log queries are computationally expensive |
| GET /v1/projects/:ref/endpoints/usage.api-counts          | 30 requests     | 1 minute | Analytics aggregation is computationally expensive |
| GET /v1/projects/:ref/endpoints/usage.api-requests-count   | 30 requests     | 1 minute | Analytics aggregation is computationally expensive |
| GET /v1/projects/:ref/database/context                     | 10 requests     | 1 minute | Database context operations are resource-intensive |
| GET /v1/projects/:ref/database/context                     | 1 request      | 1 second | Burst limit to prevent rapid successive requests  |
| POST /v1/projects/:ref/config/custom-hostname/initialize   | 10 requests     | 1 minute | These operations are expensive                    |
| POST /v1/projects/:ref/config/custom-hostname/reverify     | 10 requests     | 1 minute | These operations are expensive                    |
| DELETE /v1/projects/:ref/config/custom-hostname            | 10 requests     | 1 minute | These operations are expensive                    |
| GET /v1/projects/:ref/config/vanity-subdomain              | 10 requests     | 1 minute | These operations are expensive                    |

### Best Practices

- **Monitor Rate Limit Headers**: Check `X-RateLimit-Remaining` to manage request rates.
- **Implement Exponential Backoff**: Wait before retrying after a `429` response.
- **Batch Operations**: Combine multiple operations into fewer API calls.
- **Be Mindful of Expensive Endpoints**: Use analytics and resource-intensive endpoints judiciously.

## Additional Links

- [OpenAPI Docs](https://supabase.com/docs/reference/api/)
- [OpenAPI Spec](https://supabase.com/docs/reference/api/)
- [Report Bugs and Issues](https://supabase.com/docs/reference/api/)