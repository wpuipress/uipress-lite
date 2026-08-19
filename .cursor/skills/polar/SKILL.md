```markdown
---
name: api-reference
description: Provides a comprehensive guide to using the Polar API for managing software monetization, including checkouts, subscriptions, customer management, and more. Ideal for developers integrating Polar's billing infrastructure into their applications.
---

# Overview

The Polar API allows developers to monetize software by providing a robust billing infrastructure. It supports creating and managing checkouts, subscriptions, customers, and more, with features like automated tax compliance and license key management. The API is designed for both backend integration (using Organization Access Tokens) and customer-facing applications (using Customer Access Tokens).

# Quick Start

## Base URLs

- **Production**: `https://api.polar.sh/v1`
- **Sandbox**: `https://sandbox-api.polar.sh/v1`

Use the sandbox environment for testing as it is isolated from production.

## Authentication

- **Organization Access Tokens (OAT)**: Use for backend operations.
  ```http
  Authorization: Bearer polar_oat_xxxxxxxxxxxxxxxxx
  ```

- **Customer Access Tokens**: Generated server-side for customer-facing operations.

## Example: Create a Checkout Session

```go
package main

import (
    "context"
    "os"
    polargo "github.com/polarsource/polar-go"
    "log"
)

func main() {
    ctx := context.Background()
    s := polargo.New(polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")))

    res, err := s.Checkouts.Create(ctx, components.CheckoutCreateRequest{})
    if err != nil {
        log.Fatal(err)
    }
    if res.Checkout != nil {
        // handle response
    }
}
```

# Section Index

- **[overview](sections/overview.md)**: Introduction to the Polar API and its environments.
- **[customer-portal](sections/customer-portal.md)**: Managing customer sessions and organizations.
- **[checkouts](sections/checkouts.md)**: Creating and managing checkout sessions.
- **[customers](sections/customers.md)**: Handling customer data and states.
- **[subscriptions](sections/subscriptions.md)**: Managing subscription lifecycles.
- **[webhooks](sections/webhooks.md)**: Setting up and handling webhook events.
- **[orders](sections/orders.md)**: Order management and invoice generation.
- **[license-keys](sections/license-keys.md)**: License key activation and deactivation.

# Key Concepts

- **Core API vs Customer Portal API**: Core API is for backend operations using OAT, while Customer Portal API is for customer interactions using Customer Access Tokens.
- **Sandbox Environment**: Use for testing without affecting production data.
- **Authentication**: Securely manage access tokens and never expose them in client-side code.

# Common Examples

- **Get Customer**: Retrieve customer details using the Customer Portal API.
- **List Subscriptions**: Fetch all subscriptions associated with an organization.
- **Create Webhook Endpoint**: Set up endpoints to receive real-time updates.

# Important Notes

- Always use secure methods to store and manage access tokens.
- Regularly update your integration to accommodate any changes in API endpoints or authentication methods.
- For detailed API reference, see the respective section files like [checkouts](sections/checkouts.md) and [subscriptions](sections/subscriptions.md).

For more detailed information, refer to the specific section files listed above.
```