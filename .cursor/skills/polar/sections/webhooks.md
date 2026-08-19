# Webhooks Reference - Polar

This document provides a comprehensive overview of the webhook events available in the Polar API, specifically focusing on the `customer.state_changed` event and the creation of webhook endpoints.

## Overview of Webhooks

Webhooks are automated messages sent from apps when something happens. They provide real-time updates and allow you to receive notifications about specific events in your application. In Polar, webhooks can be triggered by various events related to customers, orders, subscriptions, and more.

## Webhook Events

### customer.state_changed

The `customer.state_changed` webhook is triggered when there is a change in a customer's state. This includes events such as:

- Customer creation, update, or deletion.
- Subscription creation or update.
- Granting or revoking benefits.

#### Payload Structure

The payload for the `customer.state_changed` event contains the following fields:

```json
{
  "type": "customer.state_changed",
  "timestamp": "2023-11-07T05:31:56Z",
  "data": {
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
}
```

### Create Webhook Endpoint

To create a webhook endpoint in Polar, you can use the following API request:

#### Request

```http
POST https://api.polar.sh/v1/webhooks/endpoints
```

#### Example Code

Here is an example of how to create a webhook endpoint using Go:

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

    res, err := s.Webhooks.CreateWebhookEndpoint(ctx, components.WebhookEndpointCreate{
        URL: "https://webhook.site/cb791d80-f26e-4f8c-be88-6e56054192b0",
        Format: components.WebhookFormatSlack,
        Events: []components.WebhookEventType{
            components.WebhookEventTypeSubscriptionCanceled,
        },
        OrganizationID: polargo.Pointer("1dbfc517-0bbf-4301-9ba8-555ca42b9737"),
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.WebhookEndpoint != nil {
        // handle response
    }
}
```

#### Response

A successful response will return the created webhook endpoint details:

```json
{
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "id": "<string>",
  "url": "<string>",
  "format": "raw",
  "secret": "<string>",
  "organization_id": "<string>",
  "events": [
    "checkout.created"
  ],
  "enabled": true
}
```

### Authorization

To create a webhook endpoint, you need to provide an `Authorization` header with your Organization Access Token.

### Body Parameters

| Parameter          | Type                | Required | Description                                              |
|--------------------|---------------------|----------|----------------------------------------------------------|
| url                | string<uri>         | Yes      | The URL where the webhook events will be sent.          |
| format             | enum<string>        | Yes      | The format of the webhook payload (`raw`, `discord`, `slack`). |
| events             | enum<string>[]      | Yes      | The events that will trigger the webhook.               |
| organization_id    | string<uuid4>       | Yes      | The organization ID.                                    |

This concludes the reference for the `customer.state_changed` webhook and the creation of webhook endpoints in Polar. For further details, please refer to the [Polar API documentation](https://polar.sh/docs/api-reference/webhooks).