# Orders API Reference

This section provides detailed information about the Orders API in Polar, including how to retrieve, update, and manage orders. It covers the following endpoints:

- Get Order
- Update Order
- List Orders
- Generate Order Invoice
- Get Order Invoice

## Get Order

### Overview
Retrieve the details of a specific order using its ID.

### Request

**Endpoint:**
```
GET https://api.polar.sh/v1/orders/{id}
```

**Authorization:**
- Type: `string`
- Location: `header`
- Required: Yes

### Path Parameters

| Parameter | Type       | Required | Description                  |
|-----------|------------|----------|------------------------------|
| id        | string<uuid4> | Yes      | The order ID.                |

### Response

**Success (200):**
```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "status": "pending",
  "paid": true,
  "subtotal_amount": 123,
  "discount_amount": 123,
  "net_amount": 123,
  "tax_amount": 123,
  "total_amount": 123,
  "applied_balance_amount": 123,
  "due_amount": 123,
  "refunded_amount": 123,
  "refunded_tax_amount": 123,
  "currency": "<string>",
  "billing_reason": "purchase",
  "billing_name": "<string>",
  "billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  },
  "invoice_number": "<string>",
  "is_invoice_generated": true,
  "customer_id": "<string>",
  "product_id": "<string>",
  "discount_id": "<string>",
  "subscription_id": "<string>",
  "checkout_id": "<string>",
  "metadata": {},
  "platform_fee_amount": 123,
  "platform_fee_currency": "usd",
  "customer": {
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
    "type": "individual"
  },
  "user_id": "<string>",
  "product": {
    "metadata": {},
    "id": "<string>",
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "trial_interval": "day",
    "trial_interval_count": 123,
    "name": "<string>",
    "description": "<string>",
    "recurring_interval": "day",
    "recurring_interval_count": 123,
    "is_recurring": true,
    "is_archived": true,
    "organization_id": "<string>"
  },
  "discount": {
    "duration": "once",
    "type": "fixed",
    "amount": 123,
    "currency": "<string>",
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "id": "<string>",
    "metadata": {},
    "name": "<string>",
    "code": "<string>",
    "starts_at": "2023-11-07T05:31:56Z",
    "ends_at": "2023-11-07T05:31:56Z",
    "max_redemptions": 123,
    "redemptions_count": 123,
    "organization_id": "<string>"
  },
  "subscription": {
    "metadata": {},
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "id": "<string>",
    "amount": 123,
    "currency": "<string>",
    "recurring_interval": "day",
    "recurring_interval_count": 123,
    "status": "incomplete",
    "current_period_start": "2023-11-07T05:31:56Z",
    "current_period_end": "2023-11-07T05:31:56Z",
    "trial_start": "2023-11-07T05:31:56Z",
    "trial_end": "2023-11-07T05:31:56Z",
    "cancel_at_period_end": true,
    "canceled_at": "2023-11-07T05:31:56Z",
    "started_at": "2023-11-07T05:31:56Z",
    "ends_at": "2023-11-07T05:31:56Z",
    "ended_at": "2023-11-07T05:31:56Z",
    "customer_id": "<string>",
    "product_id": "<string>",
    "discount_id": "<string>",
    "checkout_id": "<string>",
    "customer_cancellation_reason": "customer_service",
    "customer_cancellation_comment": "<string>",
    "seats": 123
  },
  "items": [
    {
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "id": "<string>",
      "label": "<string>",
      "amount": 123,
      "tax_amount": 123,
      "proration": true,
      "product_price_id": "<string>"
    }
  ],
  "description": "<string>",
  "seats": 123,
  "custom_field_data": {}
}
```

**Error Responses:**
- **404 Not Found**: The order ID does not exist.
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

### Example Code
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

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Orders.Get(ctx, "<value>")
	if err != nil {
		log.Fatal(err)
	}
	if res.Order != nil {
		// handle response
	}
}
```

## Update Order

### Overview
Update the details of a specific order using its ID.

### Request

**Endpoint:**
```
PATCH https://api.polar.sh/v1/orders/{id}
```

**Authorization:**
- Type: `string`
- Location: `header`
- Required: Yes

### Path Parameters

| Parameter | Type       | Required | Description                  |
|-----------|------------|----------|------------------------------|
| id        | string<uuid4> | Yes      | The order ID.                |

### Body

| Parameter         | Type                | Required | Description                                       |
|-------------------|---------------------|----------|---------------------------------------------------|
| billing_name      | string | No       | The name of the customer that should appear on the invoice. |
| billing_address   | AddressInput        | No       | The address of the customer that should appear on the invoice. |

### Response

**Success (200):**
```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "status": "pending",
  "paid": true,
  "subtotal_amount": 123,
  "discount_amount": 123,
  "net_amount": 123,
  "tax_amount": 123,
  "total_amount": 123,
  "applied_balance_amount": 123,
  "due_amount": 123,
  "refunded_amount": 123,
  "refunded_tax_amount": 123,
  "currency": "<string>",
  "billing_reason": "purchase",
  "billing_name": "<string>",
  "billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  },
  "invoice_number": "<string>",
  "is_invoice_generated": true,
  "customer_id": "<string>",
  "product_id": "<string>",
  "discount_id": "<string>",
  "subscription_id": "<string>",
  "checkout_id": "<string>",
  "metadata": {},
  "platform_fee_amount": 123,
  "platform_fee_currency": "usd",
  "customer": {
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
    "type": "individual"
  },
  "user_id": "<string>",
  "product": {
    "metadata": {},
    "id": "<string>",
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "trial_interval": "day",
    "trial_interval_count": 123,
    "name": "<string>",
    "description": "<string>",
    "recurring_interval": "day",
    "recurring_interval_count": 123,
    "is_recurring": true,
    "is_archived": true,
    "organization_id": "<string>"
  },
  "discount": {
    "duration": "once",
    "type": "fixed",
    "amount": 123,
    "currency": "<string>",
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "id": "<string>",
    "metadata": {},
    "name": "<string>",
    "code": "<string>",
    "starts_at": "2023-11-07T05:31:56Z",
    "ends_at": "2023-11-07T05:31:56Z",
    "max_redemptions": 123,
    "redemptions_count": 123,
    "organization_id": "<string>"
  },
  "subscription": {
    "metadata": {},
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "id": "<string>",
    "amount": 123,
    "currency": "<string>",
    "recurring_interval": "day",
    "recurring_interval_count": 123,
    "status": "incomplete",
    "current_period_start": "2023-11-07T05:31:56Z",
    "current_period_end": "2023-11-07T05:31:56Z",
    "trial_start": "2023-11-07T05:31:56Z",
    "trial_end": "2023-11-07T05:31:56Z",
    "cancel_at_period_end": true,
    "canceled_at": "2023-11-07T05:31:56Z",
    "started_at": "2023-11-07T05:31:56Z",
    "ends_at": "2023-11-07T05:31:56Z",
    "ended_at": "2023-11-07T05:31:56Z",
    "customer_id": "<string>",
    "product_id": "<string>",
    "discount_id": "<string>",
    "checkout_id": "<string>",
    "customer_cancellation_reason": "customer_service",
    "customer_cancellation_comment": "<string>",
    "seats": 123
  },
  "items": [
    {
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "id": "<string>",
      "label": "<string>",
      "amount": 123,
      "tax_amount": 123,
      "proration": true,
      "product_price_id": "<string>"
    }
  ],
  "description": "<string>",
  "seats": 123,
  "custom_field_data": {}
}
```

**Error Responses:**
- **404 Not Found**: The order ID does not exist.
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

### Example Code
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

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Orders.Update(ctx, "<value>", components.OrderUpdate{
		BillingName: polargo.Pointer("<value>"),
		BillingAddress: &components.AddressInput{
			Country: components.CountryAlpha2InputUs,
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	if res.Order != nil {
		// handle response
	}
}
```

## List Orders

### Overview
Retrieve a list of orders, optionally filtered by organization ID.

### Request

**Endpoint:**
```
GET https://api.polar.sh/v1/orders
```

**Authorization:**
- Type: `string`
- Location: `header`
- Required: Yes

### Query Parameters

| Parameter           | Type       | Required | Description                  |
|---------------------|------------|----------|------------------------------|
| organization_id     | string<uuid4> | No       | Filter by organization ID.   |
| product_id          | string<uuid4> | No       | Filter by product ID.        |

### Response

**Success (200):**
```json
{
  "items": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "status": "pending",
      "paid": true,
      "subtotal_amount": 123,
      "discount_amount": 123,
      "net_amount": 123,
      "tax_amount": 123,
      "total_amount": 123,
      "applied_balance_amount": 123,
      "due_amount": 123,
      "refunded_amount": 123,
      "refunded_tax_amount": 123,
      "currency": "<string>",
      "billing_reason": "purchase",
      "billing_name": "<string>",
      "billing_address": {
        "country": "AD",
        "line1": "<string>",
        "line2": "<string>",
        "postal_code": "<string>",
        "city": "<string>",
        "state": "<string>"
      },
      "invoice_number": "<string>",
      "is_invoice_generated": true,
      "customer_id": "<string>",
      "product_id": "<string>",
      "discount_id": "<string>",
      "subscription_id": "<string>",
      "checkout_id": "<string>",
      "metadata": {},
      "platform_fee_amount": 123,
      "platform_fee_currency": "usd",
      "customer": {
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
        "type": "individual"
      },
      "user_id": "<string>",
      "product": {
        "metadata": {},
        "id": "<string>",
        "created_at": "2023-11-07T05:31:56Z",
        "modified_at": "2023-11-07T05:31:56Z",
        "trial_interval": "day",
        "trial_interval_count": 123,
        "name": "<string>",
        "description": "<string>",
        "recurring_interval": "day",
        "recurring_interval_count": 123,
        "is_recurring": true,
        "is_archived": true,
        "organization_id": "<string>"
      },
      "discount": {
        "duration": "once",
        "type": "fixed",
        "amount": 123,
        "currency": "<string>",
        "created_at": "2023-11-07T05:31:56Z",
        "modified_at": "2023-11-07T05:31:56Z",
        "id": "<string>",
        "metadata": {},
        "name": "<string>",
        "code": "<string>",
        "starts_at": "2023-11-07T05:31:56Z",
        "ends_at": "2023-11-07T05:31:56Z",
        "max_redemptions": 123,
        "redemptions_count": 123,
        "organization_id": "<string>"
      },
      "subscription": {
        "metadata": {},
        "created_at": "2023-11-07T05:31:56Z",
        "modified_at": "2023-11-07T05:31:56Z",
        "id": "<string>",
        "amount": 123,
        "currency": "<string>",
        "recurring_interval": "day",
        "recurring_interval_count": 123,
        "status": "incomplete",
        "current_period_start": "2023-11-07T05:31:56Z",
        "current_period_end": "2023-11-07T05:31:56Z",
        "trial_start": "2023-11-07T05:31:56Z",
        "trial_end": "2023-11-07T05:31:56Z",
        "cancel_at_period_end": true,
        "canceled_at": "2023-11-07T05:31:56Z",
        "started_at": "2023-11-07T05:31:56Z",
        "ends_at": "2023-11-07T05:31:56Z",
        "ended_at": "2023-11-07T05:31:56Z",
        "customer_id": "<string>",
        "product_id": "<string>",
        "discount_id": "<string>",
        "checkout_id": "<string>",
        "customer_cancellation_reason": "customer_service",
        "customer_cancellation_comment": "<string>",
        "seats": 123
      },
      "items": [
        {
          "created_at": "2023-11-07T05:31:56Z",
          "modified_at": "2023-11-07T05:31:56Z",
          "id": "<string>",
          "label": "<string>",
          "amount": 123,
          "tax_amount": 123,
          "proration": true,
          "product_price_id": "<string>"
        }
      ],
      "description": "<string>",
      "seats": 123,
      "custom_field_data": {}
    }
  ],
  "pagination": {
    "total_count": 123,
    "max_page": 123
  }
}
```

**Error Responses:**
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

### Example Code
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

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Orders.List(ctx, operations.OrdersListRequest{
		OrganizationID: polargo.Pointer(operations.CreateOrdersListQueryParamOrganizationIDFilterStr(
			"1dbfc517-0bbf-4301-9ba8-555ca42b9737",
		)),
	})
	if err != nil {
		log.Fatal(err)
	}
	if res.ListResourceOrder != nil {
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

## Generate Order Invoice

### Overview
Generate an invoice for a specific order.

### Request

**Endpoint:**
```
POST https://api.polar.sh/v1/orders/{id}/invoice
```

**Authorization:**
- Type: `string`
- Location: `header`
- Required: Yes

### Path Parameters

| Parameter | Type       | Required | Description                  |
|-----------|------------|----------|------------------------------|
| id        | string<uuid4> | Yes      | The order ID.                |

### Response

**Success (202):**
```json
{
  "url": "<string>"
}
```

**Error Responses:**
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

### Example Code
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

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Orders.GenerateInvoice(ctx, "<value>")
	if err != nil {
		log.Fatal(err)
	}
	if res.Any != nil {
		// handle response
	}
}
```

## Get Order Invoice

### Overview
Retrieve the invoice for a specific order.

### Request

**Endpoint:**
```
GET https://api.polar.sh/v1/orders/{id}/invoice
```

**Authorization:**
- Type: `string`
- Location: `header`
- Required: Yes

### Path Parameters

| Parameter | Type       | Required | Description                  |
|-----------|------------|----------|------------------------------|
| id        | string<uuid4> | Yes      | The order ID.                |

### Response

**Success (200):**
```json
{
  "url": "<string>"
}
```

**Error Responses:**
- **404 Not Found**: The invoice has not been generated.
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

### Example Code
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

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Orders.Invoice(ctx, "<value>")
	if err != nil {
		log.Fatal(err)
	}
	if res.OrderInvoice != nil {
		// handle response
	}
}
```

This document provides a comprehensive overview of the Orders API, detailing the endpoints available for managing orders, including their request and response formats, authorization requirements, and example code snippets for implementation.