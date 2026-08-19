# Update Organization - Polar

This section provides detailed information on how to update an organization using the Polar API. It covers the necessary endpoints, request parameters, body structure, and expected responses.

## Endpoint

### PATCH Request

- **URL**: `https://api.polar.sh/v1/organizations/{id}`
- **Sandbox URL**: `https://sandbox-api.polar.sh/v1/organizations/{id}`

## Authorizations

- **Authorization**: Required
  - Type: `string`
  - Location: `header`
  - Description: You can generate an Organization Access Token from your organization's settings.

## Path Parameters

| Parameter | Type        | Required | Description                     |
|-----------|-------------|----------|---------------------------------|
| id        | string<uuid4> | Yes      | The organization ID. Example: `"1dbfc517-0bbf-4301-9ba8-555ca42b9737"` |

## Request Body

The request body must be in `application/json` format and can include the following fields:

| Field                        | Type                               | Description                                           |
|------------------------------|------------------------------------|-------------------------------------------------------|
| name                         | string \| null                     | Minimum string length: `3`                            |
| avatar_url                   | string<uri> \| null               | Required string length: `1 - 2083`                    |
| email                        | string<email> \| null              | Public support email.                                 |
| website                      | string<uri> \| null               | Official website of the organization. Required string length: `1 - 2083` |
| socials                      | OrganizationSocialLink[] \| null  | Links to social profiles.                             |
| details                      | OrganizationDetails                | Additional, private, business details for compliance (KYC). |
| feature_settings             | OrganizationFeatureSettings        | Feature settings for the organization.                |
| subscription_settings        | OrganizationSubscriptionSettings   | Subscription management settings.                     |
| notification_settings        | OrganizationNotificationSettings   | Notification settings.                                |
| customer_email_settings      | OrganizationCustomerEmailSettings  | Customer email settings.                              |
| customer_portal_settings     | OrganizationCustomerPortalSettings | Customer portal settings.                             |

## Response

### Successful Response (200)

The response will be in `application/json` format and will include the following fields:

| Field                        | Type                               | Description                                           |
|------------------------------|------------------------------------|-------------------------------------------------------|
| created_at                   | string<date-time>                  | Creation timestamp of the object.                     |
| modified_at                  | string<date-time> \| null          | Last modification timestamp of the object.            |
| id                           | string<uuid4>                      | The ID of the object.                                 |
| name                         | string                             | Organization name shown in various interfaces.        |
| slug                         | string                             | Unique organization slug.                             |
| avatar_url                   | string \| null                     | Avatar URL shown in various interfaces.               |
| proration_behavior           | enum<string>                       | Proration behavior for subscription updates. Available options: `invoice`, `prorate` |
| allow_customer_updates       | boolean                            | Whether customers can update their subscriptions.     |
| email                        | string \| null                     | Public support email.                                 |
| website                      | string \| null                     | Official website of the organization.                 |
| socials                      | OrganizationSocialLink[]           | Links to social profiles.                             |
| status                       | enum<string>                       | Current organization status. Available options: `created`, `onboarding_started`, `initial_review`, `ongoing_review`, `denied`, `active` |
| details_submitted_at         | string<date-time> \| null          | When the business details were submitted.            |
| feature_settings             | OrganizationFeatureSettings        | Organization feature settings.                        |
| subscription_settings        | OrganizationSubscriptionSettings   | Settings related to subscriptions management.         |
| notification_settings        | OrganizationNotificationSettings   | Settings related to notifications.                    |
| customer_email_settings      | OrganizationCustomerEmailSettings  | Settings related to customer emails.                  |
| customer_portal_settings     | OrganizationCustomerPortalSettings | Settings related to the customer portal.              |

## Code Example

Here is a code example demonstrating how to update an organization using the Polar Go SDK:

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

    res, err := s.Organizations.Update(ctx, "1dbfc517-0bbf-4301-9ba8-555ca42b9737", components.OrganizationUpdate{})
    if err != nil {
        log.Fatal(err)
    }
    if res.Organization != nil {
        // handle response
    }
}
```

This document serves as a reference for updating organizations in the Polar API, providing all necessary details for implementation.