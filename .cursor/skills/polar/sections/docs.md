# Polar API Documentation Reference

This document serves as a reference for the Polar API, covering various endpoints related to benefits, checkout links, customer management, subscriptions, and more. Each section includes the HTTP method, endpoint, a brief description, and required scopes.

## Benefits API

### Create Benefit
- **Endpoint**: `POST /v1/benefits/`
- **Description**: Create a benefit.
- **Scopes**: `benefits:write`

### Delete Benefit
- **Endpoint**: `DELETE /v1/benefits/{id}`
- **Description**: Delete a benefit. All grants associated with the benefit will be revoked.
- **Scopes**: `benefits:write`

### Get Benefit
- **Endpoint**: `GET /v1/benefits/{id}`
- **Description**: Get a benefit by ID.
- **Scopes**: `benefits:read`, `benefits:write`

### List Benefits
- **Endpoint**: `GET /v1/benefits/`
- **Description**: List benefits.
- **Scopes**: `benefits:read`, `benefits:write`

### List Benefit Grants
- **Endpoint**: `GET /v1/benefits/{id}/grants`
- **Description**: List the individual grants for a benefit.
- **Scopes**: `benefits:read`, `benefits:write`

### Update Benefit
- **Endpoint**: `PATCH /v1/benefits/{id}`
- **Description**: Update a benefit.
- **Scopes**: `benefits:write`

## Checkout Links API

### Create Checkout Link
- **Endpoint**: `POST /v1/checkout-links/`
- **Description**: Create a checkout link. Useful for generating checkout sessions from websites or social media.
- **Scopes**: `checkout_links:write`

### Delete Checkout Link
- **Endpoint**: `DELETE /v1/checkout-links/{id}`
- **Description**: Delete a checkout link.
- **Scopes**: `checkout_links:write`

### Get Checkout Link
- **Endpoint**: `GET /v1/checkout-links/{id}`
- **Description**: Get a checkout link by ID.
- **Scopes**: `checkout_links:read`, `checkout_links:write`

### List Checkout Links
- **Endpoint**: `GET /v1/checkout-links/`
- **Description**: List checkout links.
- **Scopes**: `checkout_links:read`, `checkout_links:write`

### Update Checkout Link
- **Endpoint**: `PATCH /v1/checkout-links/{id}`
- **Description**: Update a checkout link.
- **Scopes**: `checkout_links:write`

## Checkout Sessions API

### Create Checkout Session
- **Endpoint**: `POST /v1/checkouts/`
- **Description**: Create a checkout session.
- **Scopes**: `checkouts:write`

### Get Checkout Session
- **Endpoint**: `GET /v1/checkouts/{id}`
- **Description**: Get a checkout session by ID.
- **Scopes**: `checkouts:read`, `checkouts:write`

### List Checkout Sessions
- **Endpoint**: `GET /v1/checkouts/`
- **Description**: List checkout sessions.
- **Scopes**: `checkouts:read`, `checkouts:write`

### Update Checkout Session
- **Endpoint**: `PATCH /v1/checkouts/{id}`
- **Description**: Update a checkout session.
- **Scopes**: `checkouts:write`

## Customer Management API

### Create Customer
- **Endpoint**: `POST /v1/customers/`
- **Description**: Create a customer.
- **Scopes**: `customers:write`

### Delete Customer
- **Endpoint**: `DELETE /v1/customers/{id}`
- **Description**: Delete a customer. This action cannot be undone and will cancel any active subscriptions.
- **Scopes**: `customers:write`

### Get Customer
- **Endpoint**: `GET /v1/customers/{id}`
- **Description**: Get a customer by ID.
- **Scopes**: `customers:read`, `customers:write`

### List Customers
- **Endpoint**: `GET /v1/customers/`
- **Description**: List customers.
- **Scopes**: `customers:read`, `customers:write`

## Subscriptions API

### Create Subscription
- **Endpoint**: `POST /v1/subscriptions/`
- **Description**: Create a subscription programmatically. Only allows creation on free products.
- **Scopes**: `subscriptions:write`

### Get Subscription
- **Endpoint**: `GET /v1/subscriptions/{id}`
- **Description**: Get a subscription by ID.
- **Scopes**: `subscriptions:read`, `subscriptions:write`

### List Subscriptions
- **Endpoint**: `GET /v1/subscriptions/`
- **Description**: List subscriptions.
- **Scopes**: `subscriptions:read`, `subscriptions:write`

### Update Subscription
- **Endpoint**: `PATCH /v1/subscriptions/{id}`
- **Description**: Update a subscription.
- **Scopes**: `subscriptions:write`

### Cancel Subscription
- **Endpoint**: `DELETE /v1/customer-portal/subscriptions/{id}`
- **Description**: Cancel a subscription of the authenticated customer.
- **Scopes**: `customer_portal:write`

## Rate Limits

- **Requests**: 300 requests per minute per organization/customer.
- **Unauthenticated License Key Operations**: 3 requests per second.

If you exceed the rate limit, you will receive a `429 Too Many Requests` response.

## Pagination

Use the `page` and `limit` query parameters to control pagination for list endpoints.

| Parameter | Type    | Default | Max   | Description                                      |
| --------- | ------- | ------- | ----- | ------------------------------------------------ |
| `page`    | integer | `1`     | -     | Page number, starting from 1                     |
| `limit`   | integer | `10`    | `100` | Number of items to return per page               |

## Example Request

```bash
curl https://api.polar.sh/v1/products/?page=1&limit=100 \
  -H "Authorization: Bearer $POLAR_OAT" \
  -H "Accept: application/json"
```

## Conclusion

This reference document provides a concise overview of the Polar API endpoints, their purposes, and required scopes. For more detailed information, please refer to the official [Polar API documentation](https://polar.sh/docs).