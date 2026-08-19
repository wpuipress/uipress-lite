```yaml
name: supabase-management-api
description: This skill provides guidance on using the Supabase Management API to programmatically manage Supabase organizations and projects. Ideal for developers looking to automate workflows or integrate Supabase functionalities into third-party applications.
```

## Overview

The Supabase Management API allows developers to manage Supabase organizations and projects programmatically. This API is essential for automating workflows, integrating with third-party applications, and managing Supabase resources without using the web interface. Authentication is required for all API requests, which can be done using Personal Access Tokens (PATs) or OAuth2.

## Quick Start

### Authentication

All API requests require an access token in the Authorization header:

```bash
curl https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer <access_token>"
```

#### Access Tokens

1. **Personal Access Token (PAT):** Manually generated, long-lived tokens with the same privileges as your user account. Manage these tokens via your account page.
2. **OAuth2:** Generates tokens on behalf of a Supabase user, providing secure and limited access. Ideal for third-party applications. Tokens are short-lived and scope-specific.

### Rate Limits

- **Standard Rate Limit:** 120 requests per minute per user, per project/organization.
- Exceeding the limit results in a 429 Too Many Requests response. The quota resets after one minute.

## Section Index

- **[overview](sections/overview.md):** Detailed information on the Management API, including authentication and rate limits.
- **[docs](sections/docs.md):** Getting started guide and additional resources for using Supabase.

## Key Concepts Summary

- **Authentication:** Essential for API access, using PATs or OAuth2.
- **Rate Limits:** Govern the number of API requests per minute to ensure fair usage.
- **API Requests:** Must be authenticated and made over HTTPS.

## Common Examples

### List Projects

Retrieve a list of projects:

```bash
curl https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer <access_token>"
```

### Create a Project

To create a new project, use the following API endpoint with necessary parameters:

```bash
curl -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer <access_token>" \
  -d '{"name": "New Project", "organization_id": "org_id"}'
```

## Important Notes

- Keep your Personal Access Tokens secure as they carry the same privileges as your user account.
- OAuth2 tokens are recommended for third-party applications to ensure secure and limited access.
- Always check rate limits to avoid disruptions in service.

For detailed API reference, see [overview](sections/overview.md).
```