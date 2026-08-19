# API Overview - Polar

This section provides a comprehensive overview of the Polar API, including base URLs, authentication methods, API types, pagination, rate limits, and quick examples for using the API.

## Base URLs

| Environment | Base URL                          | Purpose                                 |
|-------------|-----------------------------------|-----------------------------------------|
| Production  | `https://api.polar.sh/v1`        | Real customers & live payments          |
| Sandbox     | `https://sandbox-api.polar.sh/v1`| Safe testing & integration work         |

The sandbox environment is fully isolated—data, users, tokens, and organizations created there do not affect production. Create separate tokens in each environment. Read more about the [Sandbox Environment](https://polar.sh/docs/integrate/sandbox).

## Authentication

### Organization Access Tokens (OAT)

Use an OAT to act on behalf of your organization (manage products, prices, checkouts, orders, subscriptions, benefits, etc.). 

**Example:**
```
Authorization: Bearer polar_oat_xxxxxxxxxxxxxxxxx
```

Create OATs in your organization settings. See [Organization Access Tokens](https://polar.sh/docs/integrate/oat). Never expose an OAT in client-side code, public repos, or logs.

### Customer Access Tokens

For customer-facing flows, generate a Customer Session server-side, then use the returned customer access token with the Customer Portal API to allow a signed-in customer to view their own orders, subscriptions, and benefits.

## Core API vs Customer Portal API

| Aspect                | Core API                                     | Customer Portal API                           |
|----------------------|----------------------------------------------|----------------------------------------------|
| Audience             | Your server / backend                         | One of your customers                         |
| Auth Type            | Organization Access Token (OAT)              | Customer Access Token                         |
| Scope                | Full org resources (products, orders, etc.) | Only the authenticated customer’s data       |
| Typical Use          | Admin dashboards, internal tools             | Building a custom customer portal            |
| Token Creation       | Via dashboard (manual)                       | Via `/v1/customer-sessions/` (server-side)  |
| Sensitive Operations  | Yes (create/update products, issue refunds) | No (read/update only what the customer owns) |

The Customer Portal API is designed for safe exposure in user-facing contexts and cannot perform privileged org-level mutations.

## Quick Examples

### Core API (Production)
```
curl https://api.polar.sh/v1/products/ \
  -H "Authorization: Bearer $POLAR_OAT" \
  -H "Accept: application/json"
```

### Core API (Sandbox)
```
curl https://sandbox-api.polar.sh/v1/products/ \
  -H "Authorization: Bearer $POLAR_OAT" \
  -H "Accept: application/json"
```

### Customer Portal API
```
curl https://api.polar.sh/v1/customer-portal/orders/ \
  -H "Authorization: Bearer $CUSTOMER_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

## Using SDKs

All official SDKs accept a `server` parameter for sandbox usage.

**Example (TypeScript):**
```typescript
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox", // omit or use 'production' for live
});
```

## Pagination

List endpoints in the Polar API support pagination using the `page` and `limit` query parameters.

### Query Parameters

| Parameter | Type    | Default | Max | Description                                      |
|-----------|---------|---------|-----|--------------------------------------------------|
| page      | integer | 1       | -   | Page number, starting from 1                     |
| limit     | integer | 10      | 100 | Number of items to return per page (window size) |

The `page` parameter works as a window offset. For example, `page=2&limit=10` means the API will skip the first 10 elements and return the next 10.

### Response Format

All paginated responses include a `pagination` object with metadata about the current page and total results:

| Field        | Type     | Description                                           |
|--------------|----------|-------------------------------------------------------|
| total_count  | integer  | Total number of items matching your query across all pages |
| max_page     | integer  | Total number of pages available, given the current limit value |

### Example

To fetch products with a limit of 100 items per page:
```
curl https://api.polar.sh/v1/products/?page=1&limit=100 \
  -H "Authorization: Bearer $POLAR_OAT" \
  -H "Accept: application/json"
```

In this example:
- `total_count=250` indicates there are 250 total products.
- `limit=100` means each page contains up to 100 products.
- `max_page=3` means you need to make 3 requests to retrieve all products (pages 1, 2, and 3).

To retrieve all pages, increment the `page` parameter from `1` to `max_page`. SDKs provide built-in pagination helpers to automatically iterate through all pages.

## Rate Limits

Polar API has rate limits to ensure fair usage and maintain performance:
- 300 requests per minute per organization/customer or OAuth2 Client.
- 3 requests per second for unauthenticated license key validation, activation, and deactivation endpoints.

If you exceed the rate limit, you will receive a `429 Too Many Requests` response, which includes a `Retry-After` header indicating how long to wait before making another request. Organizations requiring higher rate limits may contact support to discuss elevated limits.