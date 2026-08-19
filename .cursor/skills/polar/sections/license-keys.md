# Deactivate License Key - Polar

This section provides detailed information on how to deactivate a license key using the Polar API. It includes the necessary endpoint, request structure, authorization requirements, and possible responses.

## Endpoint

### POST Request

- **URL**: `https://api.polar.sh/v1/license-keys/deactivate`
- **Sandbox URL**: `https://sandbox-api.polar.sh/v1/license-keys/deactivate`

## Authorization

- **Authorization Header**: Required
  - Type: `string`
  - Description: You can generate an Organization Access Token from your organization's settings.

## Request Body

The request body must be in JSON format and include the following fields:

| Field            | Type        | Required | Description                       |
|------------------|-------------|----------|-----------------------------------|
| `key`            | string      | Yes      | The license key to deactivate.    |
| `organization_id`| string (uuid4)| Yes    | The ID of the organization.       |
| `activation_id`  | string (uuid4)| Yes    | The ID of the activation.         |

### Example Request

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

    res, err := s.LicenseKeys.Deactivate(ctx, components.LicenseKeyDeactivate{
        Key: "<key>",
        OrganizationID: "<value>",
        ActivationID: "<value>",
    })
    if err != nil {
        log.Fatal(err)
    }
    if res != nil {
        // handle response
    }
}
```

## Responses

### Success Response

- **HTTP Status Code**: `204`
  - Description: License key activation deactivated successfully.

### Error Responses

- **HTTP Status Code**: `404`
  - Description: Not Found.
  
- **HTTP Status Code**: `422`
  - Description: Unprocessable Entity.

### Error Response Example

```json
{
  "error": "<string>",
  "detail": "<string>"
}
```

This concludes the reference for the "Deactivate License Key" section of the Polar API documentation. For further assistance, please refer to the [Polar Documentation](https://polar.sh/docs/api-reference/license-keys/deactivate).