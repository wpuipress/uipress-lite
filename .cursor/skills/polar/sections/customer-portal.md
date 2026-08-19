# Customer Portal - Get Customer

This section provides detailed information on the "Get Customer" API endpoint of the Polar Customer Portal. It allows you to retrieve customer information based on the authenticated customer session.

## Overview

The "Get Customer" API endpoint retrieves the details of the authenticated customer. This includes personal information, billing details, and associated OAuth accounts.

## Endpoint

### GET Request

```
GET https://api.polar.sh/v1/customer-portal/customers/me
```

## Code Example

Here is a sample code snippet in Go demonstrating how to use the "Get Customer" API:

```go
package main

import (
	"context"
	polargo "github.com/polarsource/polar-go"
	"os"
	"github.com/polarsource/polar-go/models/operations"
	"log"
)

func main() {
    ctx := context.Background()

    s := polargo.New()

    res, err := s.CustomerPortal.Customers.Get(ctx, operations.CustomerPortalCustomersGetSecurity{
        CustomerSession: os.Getenv("POLAR_CUSTOMER_SESSION"),
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.CustomerPortalCustomer != nil {
        // handle response
    }
}
```

## Response

### Successful Response (200)

The successful response returns a JSON object containing customer details:

```json
{
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "id": "<string>",
  "email": "<string>",
  "email_verified": true,
  "name": "<string>",
  "billing_name": "<string>",
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
  "oauth_accounts": {},
  "default_payment_method_id": "<string>"
}
```

### Response Fields

| Field                        | Type              | Description                                         |
|------------------------------|-------------------|-----------------------------------------------------|
| created_at                   | string<date-time> | Creation timestamp of the object.                   |
| modified_at                  | string<date-time> | Last modification timestamp of the object.          |
| id                           | string<uuid4>     | The ID of the object.                               |
| email                        | string            | Customer's email address.                           |
| email_verified               | boolean           | Indicates if the email is verified.                 |
| name                         | string | null       | Customer's name.                                    |
| billing_name                 | string | null       | Billing name of the customer.                       |
| billing_address              | Address           | Billing address details.                            |
| tax_id                       | Tax Id            | Tax identification details.                          |
| oauth_accounts               | Oauth Accounts     | Associated OAuth accounts.                           |
| default_payment_method_id    | string<uuid4> | null | Default payment method ID.                           |

## Authorizations

### Required Headers

- `Authorization`: A string representing the customer session token, which is required to authenticate the request. You can create customer sessions programmatically using the Create Customer Session endpoint.

## Error Responses

- **404 Not Found**: The requested customer does not exist.
- **422 Unprocessable Entity**: The request was well-formed but was unable to be followed due to semantic errors.

This concludes the reference for the "Get Customer" API endpoint in the Polar Customer Portal. For further details, refer to the [official documentation](https://polar.sh/docs/api-reference/customer-portal/get-customer).