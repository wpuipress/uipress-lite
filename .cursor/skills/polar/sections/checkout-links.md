# Create Checkout Link - Polar

This section provides detailed information on how to create a checkout link using the Polar API. Checkout links are shareable URLs that generate checkout sessions when accessed, making them useful for initiating purchases from various platforms.

## Overview

- **Endpoint**: `POST /v1/checkout-links`
- **Authorization**: Required
- **Content-Type**: `application/json`

## Authorizations

To create a checkout link, you need to provide an Organization Access Token in the header.

### Required Header

| Header Name | Type   | Description                        |
|-------------|--------|------------------------------------|
| Authorization | string | Organization Access Token |

## Request Body

The request body must be in JSON format and include the following fields:

### Required Fields

| Field                | Type         | Description                                         |
|----------------------|--------------|-----------------------------------------------------|
| payment_processor     | string       | Currently only supports `"stripe"`.                |
| product_price_id      | string (uuid4) | ID of the product price to be used.                |

### Optional Fields

| Field                     | Type                | Description                                                                                     |
|---------------------------|---------------------|-------------------------------------------------------------------------------------------------|
| metadata                  | object              | Key-value pairs for additional information (max 50 pairs).                                   |
| trial_interval            | string (enum)       | Interval unit for the trial period (`day`, `week`, `month`, `year`).                        |
| trial_interval_count      | integer             | Number of interval units for the trial period (1 to 1000).                                   |
| label                     | string              | Optional label for internal distinction.                                                      |
| allow_discount_codes      | boolean             | Whether to allow discount codes (default: true).                                             |
| require_billing_address   | boolean             | Whether to require full billing address (default: false).                                    |
| discount_id               | string (uuid4)      | ID of the discount to apply.                                                                    |
| success_url               | string (uri)        | URL for redirection after successful payment (max length: 2083).                             |

## Example Request

Here is an example of how to create a checkout link using Go:

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

    res, err := s.CheckoutLinks.Create(ctx, components.CreateCheckoutLinkCreateCheckoutLinkCreateProductPrice(
        components.CheckoutLinkCreateProductPrice{
            ProductPriceID: "<value>",
        },
    ))
    if err != nil {
        log.Fatal(err)
    }
    if res.CheckoutLink != nil {
        // handle response
    }
}
```

## Response

Upon successful creation of a checkout link, the API will return a `201` status code along with the following response body:

### Response Fields

| Field                | Type         | Description                                         |
|----------------------|--------------|-----------------------------------------------------|
| id                   | string (uuid4) | ID of the created checkout link.                   |
| created_at           | string (date-time) | Creation timestamp of the checkout link.          |
| modified_at          | string (date-time) | Last modification timestamp of the checkout link. |
| trial_interval        | string (enum) | Interval unit for the trial period.                |
| trial_interval_count  | integer      | Number of interval units for the trial period.     |
| metadata              | object       | Metadata associated with the checkout link.        |
| payment_processor      | string       | Payment processor used (currently only `"stripe"`).|
| client_secret         | string       | Client secret for accessing the checkout link.     |
| success_url           | string       | URL for redirection after successful payment.      |
| label                 | string       | Optional label for internal distinction.           |
| allow_discount_codes   | boolean      | Indicates if discount codes can be applied.        |
| require_billing_address| boolean      | Indicates if full billing address is required.     |
| discount_id           | string (uuid4) | ID of the discount applied to the checkout.        |
| organization_id       | string (uuid4) | ID of the organization associated with the checkout link. |
| products              | array        | List of products associated with the checkout link.|
| discount              | object       | Details of any discount applied.                   |
| url                   | string       | The generated checkout link URL.                   |

## Conclusion

This section outlines the process for creating a checkout link using the Polar API. For further details, refer to the [Polar API documentation](https://polar.sh/docs/api-reference/checkout-links/create).