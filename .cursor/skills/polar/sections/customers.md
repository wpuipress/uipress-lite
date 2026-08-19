# Customers Section Reference

This document provides a comprehensive overview of the "Customers" section of the Polar API, including customer stories, API endpoints, and code examples for managing customer data.

## Overview

The "Customers" section covers the following topics:
- Customer stories showcasing how businesses have implemented Polar's billing solutions.
- API endpoints for managing customers, including listing, creating, updating, and deleting customers.
- Code examples demonstrating how to interact with the Polar API using the provided SDK.

## Customer Stories

### How Stilla AI Implemented Production-Ready Billing in Hours

**Date:** January 29th, 2026

**Challenges:**
- Building billing infrastructure from scratch.
- Required seat-based billing, organization-level management, and flexible trials.

**Why Polar:**
- Out-of-the-box seat-based billing model.
- Clean Python SDK and webhook infrastructure.
- Rapid development as a design partner.

**Improvements:**
- Straightforward integration with the Python SDK.
- Customizable customer portal.
- Flexible trial mechanisms and discount codes.

**Support Experience:**
- Direct engineering collaboration via Slack.
- Quick resolution of issues.

### How Polar Became the Turning Point for Repo Prompt

**Date:** January 29th, 2026

**Challenges:**
- Initially limited to App Store distribution with cumbersome payment processing.

**Why Polar:**
- Enabled billing on the developer's schedule.
- Unique license key system and low fees.

**Improvements:**
- Simple integration with checkout links and automatic license key generation.
- Responsive support team.

## API Reference

### List Customers

**Endpoint:** `GET /v1/customers`

#### Code Example
```go
package main

import (
	"context"
	"os"
	polargo "github.com/polarsource/polar-go"
	"github.com/polarsource/polar-go/models/operations"
	"log"
)

func main() {
    ctx := context.Background()
    s := polargo.New(polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")))
    
    res, err := s.Customers.List(ctx, operations.CustomersListRequest{
        OrganizationID: polargo.Pointer(operations.CreateCustomersListQueryParamOrganizationIDFilterStr("1dbfc517-0bbf-4301-9ba8-555ca42b9737")),
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.ListResourceCustomer != nil {
        for {
            // handle items
            res, err = res.Next()
            if err != nil {
                // handle error
            }
            if res == nil {
                break
            }
        }
    }
}
```

#### Response Example
```json
{
  "items": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "metadata": {},
      "external_id": "usr_1337",
      "email": "<string>",
      "email_verified": true,
      "name": "John Doe",
      "billing_address": {
        "country": "AD",
        "line1": "<string>",
        "line2": "<string>",
        "postal_code": "<string>",
        "city": "<string>",
        "state": "<string>"
      },
      "tax_id": {
        "[0]": "<string>"
      },
      "organization_id": "<string>",
      "deleted_at": "2023-11-07T05:31:56Z",
      "avatar_url": "<string>",
      "type": "individual",
      "members": [
        {
          "id": "<string>",
          "created_at": "2023-11-07T05:31:56Z",
          "modified_at": "2023-11-07T05:31:56Z",
          "customer_id": "<string>",
          "email": "<string>",
          "name": "Jane Doe",
          "external_id": "usr_1337",
          "role": "owner"
        }
      ]
    }
  ],
  "pagination": {
    "total_count": 123,
    "max_page": 123
  }
}
```

### Get Customer State by External ID

**Endpoint:** `GET /v1/customers/external/{external_id}/state`

#### Code Example
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
    
    res, err := s.Customers.GetStateExternal(ctx, "<id>")
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerState != nil {
        // handle response
    }
}
```

#### Response Example
```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "external_id": "usr_1337",
  "email": "<string>",
  "email_verified": true,
  "name": "John Doe",
  "billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  },
  "tax_id": {
    "[0]": "<string>"
  },
  "organization_id": "<string>",
  "deleted_at": "2023-11-07T05:31:56Z",
  "active_subscriptions": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "metadata": {},
      "status": "active",
      "amount": 123,
      "currency": "<string>",
      "recurring_interval": "day",
      "current_period_start": "2023-11-07T05:31:56Z",
      "current_period_end": "2025-03-03T13:37:00Z",
      "trial_start": "2025-02-03T13:37:00Z",
      "trial_end": "2025-03-03T13:37:00Z",
      "cancel_at_period_end": true,
      "canceled_at": null,
      "started_at": "2025-01-03T13:37:00Z",
      "ends_at": null,
      "product_id": "<string>",
      "discount_id": null,
      "meters": [
        {
          "created_at": "2023-11-07T05:31:56Z",
          "modified_at": "2023-11-07T05:31:56Z",
          "id": "<string>",
          "consumed_units": 123,
          "credited_units": 123,
          "amount": 123,
          "meter_id": "<string>"
        }
      ],
      "custom_field_data": {}
    }
  ],
  "granted_benefits": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "granted_at": "2023-11-07T05:31:56Z",
      "benefit_id": "<string>",
      "benefit_type": "custom",
      "benefit_metadata": {},
      "properties": {
        "account_id": "<string>",
        "guild_id": "<string>",
        "role_id": "<string>",
        "granted_account_id": "<string>"
      }
    }
  ],
  "active_meters": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "meter_id": "<string>",
      "consumed_units": 123,
      "credited_units": 123,
      "balance": 123
    }
  ],
  "avatar_url": "<string>",
  "type": "individual"
}
```

### Get Customer by External ID

**Endpoint:** `GET /v1/customers/external/{external_id}`

#### Code Example
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
    
    res, err := s.Customers.GetExternal(ctx, "<id>")
    if err != nil {
        log.Fatal(err)
    }
    if res.Customer != nil {
        // handle response
    }
}
```

#### Response Example
```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "external_id": "usr_1337",
  "email": "<string>",
  "email_verified": true,
  "name": "John Doe",
  "billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  },
  "tax_id": {
    "[0]": "<string>"
  },
  "organization_id": "<string>",
  "deleted_at": "2023-11-07T05:31:56Z",
  "avatar_url": "<string>",
  "type": "individual",
  "members": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "customer_id": "<string>",
      "email": "<string>",
      "name": "Jane Doe",
      "external_id": "usr_1337",
      "role": "owner"
    }
  ]
}
```

### Update Customer by External ID

**Endpoint:** `PATCH /v1/customers/external/{external_id}`

#### Code Example
```go
package main

import (
	"context"
	"os"
	polargo "github.com/polarsource/polar-go"
	"github.com/polarsource/polar-go/models/components"
	"log"
)

func main() {
    ctx := context.Background()
    s := polargo.New(polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")))
    
    res, err := s.Customers.UpdateExternal(ctx, "<id>", components.CustomerUpdateExternalID{
        Email: polargo.Pointer("[email protected]"),
        Name: polargo.Pointer("John Doe"),
        BillingAddress: nil,
        TaxID: []*components.CustomerUpdateExternalIDTaxID{
            polargo.Pointer(components.CreateCustomerUpdateExternalIDTaxIDStr("911144442")),
            polargo.Pointer(components.CreateCustomerUpdateExternalIDTaxIDStr("us_ein")),
        },
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.Customer != nil {
        // handle response
    }
}
```

#### Response Example
```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "metadata": {},
  "external_id": "usr_1337",
  "email": "<string>",
  "email_verified": true,
  "name": "John Doe",
  "billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  },
  "tax_id": {
    "[0]": "<string>"
  },
  "organization_id": "<string>",
  "deleted_at": "2023-11-07T05:31:56Z",
  "avatar_url": "<string>",
  "type": "individual",
  "members": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "customer_id": "<string>",
      "email": "<string>",
      "name": "Jane Doe",
      "external_id": "usr_1337",
      "role": "owner"
    }
  ]
}
```

### Delete Customer by External ID

**Endpoint:** `DELETE /v1/customers/external/{external_id}`

#### Code Example
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
    
    res, err := s.Customers.DeleteExternal(ctx, "<id>")
    if err != nil {
        log.Fatal(err)
    }
    if res != nil {
        // handle response
    }
}
```

#### Response Example
```json
{
  "error": "<string>",
  "detail": "<string>"
}
```

## Conclusion

This reference document provides essential information about managing customers using the Polar API, including practical examples and responses for various operations. For further details, refer to the official [Polar API documentation](https://polar.sh/docs).