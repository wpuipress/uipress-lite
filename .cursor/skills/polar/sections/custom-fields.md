# Delete Custom Field - Polar

This section provides detailed information on how to delete a custom field using the Polar API. It includes the necessary endpoint, authorization requirements, path parameters, response codes, and code examples.

## Overview

The `DELETE` method allows you to remove a custom field from your Polar account. This action is irreversible, and you must provide the ID of the custom field you wish to delete.

## Endpoint

```
DELETE https://api.polar.sh/v1/custom-fields/{id}
```

### Sandbox Endpoint

For testing purposes, you can use the sandbox environment:

```
DELETE https://sandbox-api.polar.sh/v1/custom-fields/{id}
```

## Authorization

- **Authorization**: Required
- **Type**: String (header)

You can generate an Organization Access Token from your organization's settings.

## Path Parameters

| Parameter | Type      | Required | Description                  |
|-----------|-----------|----------|------------------------------|
| id        | string<uuid4> | Yes      | The custom field ID.         |

## Response Codes

- **204**: Custom field deleted successfully.
- **404**: Custom field not found.
- **422**: Unprocessable entity (e.g., invalid ID).

### Error Response Example

In case of an error, the response will be in the following format:

```json
{
  "error": "<string>",
  "detail": "<string>"
}
```

## Code Example

Here is a code example in Go demonstrating how to delete a custom field:

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

    res, err := s.CustomFields.Delete(ctx, "<value>")
    if err != nil {
        log.Fatal(err)
    }
    if res != nil {
        // handle response
    }
}
```

This example initializes the Polar client, deletes a custom field using its ID, and handles any potential errors.