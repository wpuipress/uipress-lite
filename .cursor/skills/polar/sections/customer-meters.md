# List Customer Meters - Polar

This section provides detailed information on how to list customer meters using the Polar API. It includes the necessary endpoints, request parameters, response formats, and code examples for implementation.

## Overview

The `List Customer Meters` endpoint allows you to retrieve a list of customer meters associated with a specific organization. You can filter the results based on various parameters such as organization ID, customer ID, and meter ID.

## Endpoint

### GET Request

```
GET https://api.polar.sh/v1/customer-meters
```

## Authorization

- **Authorization**: Required. You can generate an Organization Access Token from your organization's settings.

## Query Parameters

| Parameter               | Type           | Description                                      | Example                                      |
|------------------------|----------------|--------------------------------------------------|----------------------------------------------|
| `organization_id`      | string<uuid4>  | Filter by organization ID.                        | `"1dbfc517-0bbf-4301-9ba8-555ca42b9737"`   |
| `customer_id`          | string<uuid4>  | Filter by customer ID.                           |                                              |
| `external_customer_id` | string         | Filter by external customer ID.                  |                                              |
| `meter_id`             | string<uuid4>  | Filter by meter ID.                              |                                              |
| `page`                 | integer        | Page number, defaults to 1.                      | `1`                                          |
| `limit`                | integer        | Size of a page, defaults to 10. Maximum is 100. | `10`                                         |
| `sorting`              | enum<string>[] | Sorting criteria. Use a minus sign for descending order. | `created_at`, `-created_at`                |

## Response

### Successful Response (200)

The response will contain a list of customer meters and pagination information.

```json
{
  "items": [
    {
      "id": "<string>",
      "created_at": "2023-11-07T05:31:56Z",
      "modified_at": "2023-11-07T05:31:56Z",
      "customer_id": "<string>",
      "meter_id": "<string>",
      "consumed_units": 123,
      "credited_units": 123,
      "balance": 123,
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
      "meter": {
        "metadata": {},
        "created_at": "2023-11-07T05:31:56Z",
        "modified_at": "2023-11-07T05:31:56Z",
        "id": "<string>",
        "name": "<string>",
        "filter": {
          "conjunction": "and",
          "clauses": [
            {
              "property": "<string>",
              "operator": "eq",
              "value": "<string>"
            }
          ]
        },
        "aggregation": {
          "func": "count"
        },
        "organization_id": "<string>",
        "archived_at": "2023-11-07T05:31:56Z"
      }
    }
  ],
  "pagination": {
    "total_count": 123,
    "max_page": 123
  }
}
```

### Error Response (422)

The API may return an error response if the request is malformed or if there are validation issues.

## Code Example

Here is a Go code example demonstrating how to list customer meters using the Polar API:

```go
package main

import (
	"context"
	"log"
	"os"

	polargo "github.com/polarsource/polar-go"
	"github.com/polarsource/polar-go/models/operations"
)

func main() {
	ctx := context.Background()

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.CustomerMeters.List(ctx, operations.CustomerMetersListRequest{
		OrganizationID: polargo.Pointer(operations.CreateCustomerMetersListQueryParamOrganizationIDFilterStr(
			"1dbfc517-0bbf-4301-9ba8-555ca42b9737",
		)),
	})
	if err != nil {
		log.Fatal(err)
	}
	if res.ListResourceCustomerMeter != nil {
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

This code initializes a Polar client, retrieves the list of customer meters for a specified organization, and handles pagination.