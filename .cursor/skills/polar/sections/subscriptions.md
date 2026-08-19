# Update Subscription - Polar

This section provides detailed information on how to update a subscription using the Polar API. It covers the necessary request format, parameters, response structure, and code examples for implementation.

## Overview

The `Update Subscription` endpoint allows you to modify existing subscriptions by updating various attributes such as the product, discount, trial period, and more.

## Endpoint

```
PATCH https://api.polar.sh/v1/subscriptions/{id}
```

### Authorizations

- **Authorization**: A string in the header is required. You can generate an Organization Access Token from your organization's settings.

### Path Parameters

| Parameter | Type       | Required | Description                     |
|-----------|------------|----------|---------------------------------|
| id        | string<uuid4> | Yes      | The subscription ID.            |

### Request Body

The request body must be in `application/json` format and can include the following fields:

- **SubscriptionUpdateProduct**
- **SubscriptionUpdateDiscount**
- **SubscriptionUpdateTrial**
- **SubscriptionUpdateSeats**
- **SubscriptionUpdateBillingPeriod**
- **SubscriptionCancel**
- **SubscriptionRevoke**

#### Example Request Body

```json
{
  "product_id": "d8dd2de1-21b7-4a41-8bc3-ce909c0cfe23",
  "proration_behavior": "invoice" // or "prorate"
}
```

### Response

#### Successful Response (200)

On a successful update, the response will include the updated subscription details:

```json
{
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
  "metadata": {},
  "customer": { /* Customer details */ },
  "product": { /* Product details */ },
  "discount": { /* Discount details */ },
  "prices": [ /* Price details */ ],
  "meters": [ /* Meter details */ ],
  "seats": 123,
  "custom_field_data": {}
}
```

### Error Responses

| Status Code | Description                          |
|-------------|--------------------------------------|
| 403         | Forbidden - insufficient permissions.|
| 404         | Not Found - subscription does not exist.|
| 409         | Conflict - subscription cannot be updated.|
| 422         | Unprocessable Entity - validation errors.|

## Code Example

Here is a code example using Go to update a subscription:

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

    res, err := s.Subscriptions.Update(ctx, "<value>", components.CreateSubscriptionUpdateSubscriptionUpdateDiscount(
        components.SubscriptionUpdateDiscount{
            DiscountID: polargo.Pointer("<value>"),
        },
    ))
    if err != nil {
        log.Fatal(err)
    }
    if res.Subscription != nil {
        // handle response
    }
}
```

This example demonstrates how to update a subscription by specifying the subscription ID and the discount to be applied. Adjust the parameters as needed for your specific use case.