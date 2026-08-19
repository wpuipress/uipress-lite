# Customer Seats - Polar

This section provides detailed information on managing customer seats within the Polar API. It covers the following operations: assigning seats, listing seats, revoking seats, resending invitations, retrieving claim information, and claiming seats.

## Assign Seat

### Endpoint
```
POST https://api.polar.sh/v1/customer-seats
```

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

    res, err := s.CustomerSeats.AssignSeat(ctx, components.SeatAssign{})
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerSeat != nil {
        // handle response
    }
}
```

### Request Body
| Field                  | Type              | Description                                                  |
|------------------------|-------------------|--------------------------------------------------------------|
| subscription_id        | string<uuid>      | Required if `checkout_id` and `order_id` are not provided.  |
| checkout_id            | string<uuid>      | Used to look up subscription or order from the checkout page.|
| order_id               | string<uuid>      | Required if `subscription_id` and `checkout_id` are not provided. |
| email                  | string<email>     | Email of the customer to assign the seat to.                |
| external_customer_id   | string            | External customer ID for the seat assignment.               |
| customer_id            | string<uuid>      | Customer ID for the seat assignment.                        |
| metadata               | object            | Additional metadata for the seat (max 10 keys, 1KB total). |
| immediate_claim        | boolean           | If true, the seat will be immediately claimed without sending an invitation email. Default: false. |

### Response
```json
{
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "status": "pending",
  "subscription_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "order_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "customer_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "member_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "email": "<string>",
  "customer_email": "<string>",
  "invitation_token_expires_at": "2023-11-07T05:31:56Z",
  "claimed_at": "2023-11-07T05:31:56Z",
  "revoked_at": "2023-11-07T05:31:56Z",
  "seat_metadata": {}
}
```

## List Seats

### Endpoint
```
GET https://api.polar.sh/v1/customer-seats
```

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

    res, err := s.CustomerSeats.ListSeats(ctx, nil, nil)
    if err != nil {
        log.Fatal(err)
    }
    if res.SeatsList != nil {
        // handle response
    }
}
```

### Query Parameters
| Parameter          | Type          | Description                                      |
|--------------------|---------------|--------------------------------------------------|
| subscription_id    | string<uuid4> | Optional. Filter by subscription ID.             |
| order_id           | string<uuid4> | Optional. Filter by order ID.                    |

### Response
```json
{
  "seats": [
    {
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "status": "pending",
      "subscription_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "order_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "customer_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "member_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
      "email": "<string>",
      "customer_email": "<string>",
      "invitation_token_expires_at": "2023-11-07T05:31:56Z",
      "claimed_at": "2023-11-07T05:31:56Z",
      "revoked_at": "2023-11-07T05:31:56Z",
      "seat_metadata": {}
    }
  ],
  "available_seats": 123,
  "total_seats": 123
}
```

## Revoke Seat

### Endpoint
```
DELETE https://api.polar.sh/v1/customer-seats/{seat_id}
```

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

    res, err := s.CustomerSeats.RevokeSeat(ctx, "<value>")
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerSeat != nil {
        // handle response
    }
}
```

### Path Parameters
| Parameter | Type      | Description                     |
|-----------|-----------|---------------------------------|
| seat_id   | string<uuid4> | Required. The ID of the seat to revoke. |

### Response
```json
{
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "status": "pending",
  "subscription_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "order_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "customer_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "member_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "email": "<string>",
  "customer_email": "<string>",
  "invitation_token_expires_at": "2023-11-07T05:31:56Z",
  "claimed_at": "2023-11-07T05:31:56Z",
  "revoked_at": "2023-11-07T05:31:56Z",
  "seat_metadata": {}
}
```

## Resend Invitation

### Endpoint
```
POST https://api.polar.sh/v1/customer-seats/{seat_id}/resend
```

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

    res, err := s.CustomerSeats.ResendInvitation(ctx, "<value>")
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerSeat != nil {
        // handle response
    }
}
```

### Path Parameters
| Parameter | Type      | Description                     |
|-----------|-----------|---------------------------------|
| seat_id   | string<uuid4> | Required. The ID of the seat for which to resend the invitation. |

### Response
```json
{
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "status": "pending",
  "subscription_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "order_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "customer_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "member_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "email": "<string>",
  "customer_email": "<string>",
  "invitation_token_expires_at": "2023-11-07T05:31:56Z",
  "claimed_at": "2023-11-07T05:31:56Z",
  "revoked_at": "2023-11-07T05:31:56Z",
  "seat_metadata": {}
}
```

## Get Claim Info

### Endpoint
```
GET https://api.polar.sh/v1/customer-seats/claim/{invitation_token}
```

### Example Code
```go
package main

import (
    "context"
    polargo "github.com/polarsource/polar-go"
    "log"
)

func main() {
    ctx := context.Background()

    s := polargo.New()

    res, err := s.CustomerSeats.GetClaimInfo(ctx, "<value>")
    if err != nil {
        log.Fatal(err)
    }
    if res.SeatClaimInfo != nil {
        // handle response
    }
}
```

### Path Parameters
| Parameter          | Type    | Description                     |
|--------------------|---------|---------------------------------|
| invitation_token    | string  | Required. The invitation token for the seat claim. |

### Response
```json
{
  "product_name": "<string>",
  "product_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
  "organization_name": "<string>",
  "organization_slug": "<string>",
  "customer_email": "<string>",
  "can_claim": true
}
```

## Claim Seat

### Endpoint
```
POST https://api.polar.sh/v1/customer-seats/claim
```

### Example Code
```go
package main

import (
    "context"
    polargo "github.com/polarsource/polar-go"
    "github.com/polarsource/polar-go/models/components"
    "log"
)

func main() {
    ctx := context.Background()

    s := polargo.New()

    res, err := s.CustomerSeats.ClaimSeat(ctx, components.SeatClaim{
        InvitationToken: "<value>",
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerSeatClaimResponse != nil {
        // handle response
    }
}
```

### Request Body
| Field              | Type    | Description                     |
|--------------------|---------|---------------------------------|
| invitation_token    | string  | Required. The invitation token to claim the seat. |

### Response
```json
{
  "seat": {
    "created_at": "2023-11-07T05:31:56Z",
    "modified_at": "2023-11-07T05:31:56Z",
    "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
    "status": "pending",
    "subscription_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
    "order_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
    "customer_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
    "member_id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
    "email": "<string>",
    "customer_email": "<string>",
    "invitation_token_expires_at": "2023-11-07T05:31:56Z",
    "claimed_at": "2023-11-07T05:31:56Z",
    "revoked_at": "2023-11-07T05:31:56Z",
    "seat_metadata": {}
  },
  "customer_session_token": "<string>"
}
```